const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')

module.exports = {
    genPass: function (input) {
        return bcrypt.hashSync(input, salt)
    },
    compare: function (input, pass) {
        return bcrypt.compareSync(input, pass)
    },
    decode: function(token) {
        return jwt.verify(token, process.env.JWT)
    }
}