
const mongoose = require("mongoose")


var UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        requried: false
    },
    accountActive : {
        type: Boolean,
        default: true
    },
    role: {
        type: Number,
        default: 0,
        required: true
    },
    todos: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                requried: true
            },
            completed: {
                type: Boolean,
                default: false
            }

        }
    ]
})


module.exports = mongoose.model("todousers",UsersSchema)

