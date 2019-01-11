const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);

module.exports = {
    genPass: function (input) {
        return bcrypt.hashSync(input, salt)
    },
    compare: function (input, pass) {
        return bcrypt.compareSync(input, pass)
    }
}