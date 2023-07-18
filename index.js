const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const User = require("./modals/User")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// imporint middleware
const {isLoggedIn} = require("./middlewares")

// Adding Middlewares
app.use(bodyParser.json())
app.use(cors())

// Creating Authentication Routes 
app.post("/auth/signup",(req,res) => {
 
    const {name,email,gender,password} = req.body;
    // check data validity
    if(name == undefined || gender == undefined || email == undefined || password==undefined)
    {
        return res.json({success: false,message:"Invalid Data"})
    }
    // check password
    if(password.length < 8)
    {
        return res.json({success: false,message:"Password is not strong"})
    }
    // check if account already exists with given email
    User.findOne({email: email })
    .then( user => {
        // if user already exits
    
        if(user)
        {
            return res.json({success:false,message:"Email Already in use"})
        }
        // if not we have to create
        let newUser = new User({name: name,email: email,gender: gender})

        bcrypt.hash(password,10, (err,codedPassword) => {
            if(err) 
            {
               return res.json({success: false, message:"Something Went Wrong!"})
            }
            // if no erro set passord
            newUser.password = codedPassword;
            newUser.save()
            .then(user => {
                return res.json({success: true, message:"Account Created",user: newUser})
            })
            .catch(err =>  res.json({success: false, message:"Something Went Wrong!"}))
            
        })

       
    })
    .catch( () => res.json({success: false, message:"Something Went Wrong!"}))

})

app.post("/auth/login",(req,res) => {
    const {email,password} = req.body;
    // chekc if values are valid
    if( email == undefined || password==undefined)
    {
        return res.json({success: false,message:"Invalid Credentials"})
    }
    // check if adcount exits
    User.findOne({email: email})
    .then(user => {

        // if email not exits
        if(!user )
        {
            return res.json({success: false,message:"Email not Found"})
        }
        // else check the password
        bcrypt.compare(password, user.password, function(err, result) {
            // result == true
            if(result == true)
            {
                const token = jwt.sign({
                    id: user._id,
                    email: user.email
                },"5678ABC",{ expiresIn: '1h' })
                
                return res.json({success: true,token: token
                 })
            }
            else
            {
                return res.json({success: false, message:"Invalid Password"})
            }
        });



    })
    .catch( () => res.json({success: false, message:"Something Went Wrong!"}))


})



// Protected Routes
app.get("/getTodos",isLoggedIn,(req,res) => {

    // check token
    User.findById(req.user.id)
    .then(data => {
        res.json({success:true, todos: data.todos})
    })
    .catch(err => res.json({success: false, message:"Something Went Wrong !"}))

})

app.post("/addtodo",isLoggedIn,(req,res) => {

    const {title,description} = req.body;
    const userId = req.user.id;

    User.findById(userId)
    .then(user => {
        user.todos.push({title,description})
        user.save()
        .then(() => res.json({success: true, message:"Todo Added"}))
        .catch(err => res.json({success: false,messaage:"Faile"}))
    })
    .catch(err => res.json({success: false, message:"Something Went Wrong !"}))
})



// connection to database
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0")
.then(() => {
    console.log("Database Connected")
})
.catch(() => {
    console.log("Connection Failed")
})

// Running the express app
const PORT = 3001
app.listen(PORT,() => {
    console.log("App is running on port ",PORT)
})