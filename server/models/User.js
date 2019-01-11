const mongoose = require('mongoose');
const Schema = mongoose.Schema 

function CheckUnique() {
    return new Promise((res, rej) =>{
        User.findOne({email: this.email, _id: {$ne: this._id}})
            .then(data => {
                if(data) {
                    res(false)
                } else {
                    res(true)
                }
            })
            .catch(err => {
                res(false)
            })
    })
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name must be filled']
      },
    email: {
        type: String,
        required: [true, 'Email must be filled'],
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
        validate: [CheckUnique, 'Email already taken']
      }, 
    password: {
        type: String,
        minlength: [6, `Minimal password length is 6`]
      },
    google: {
        type: Boolean,
        required: [true, `please defined provider`]
    }
})

userSchema.pre('save' , function(next) {
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;