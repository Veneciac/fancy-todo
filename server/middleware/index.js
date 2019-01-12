const decode = require('../helper').decode
const User = require('../models/User')
const mongoose = require('mongoose')

module.exports = {
    CheckUser: function(req, res, next) {
        if (!req.headers.token) {
            res.status(403).json({
                msg: `Please login first`
            })
        } else {
            let id = decode(req.headers.token).id
            try{
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    res.status(400).json({
                        msg: `Id invalid`
                    })
                } else {
                    User.findById(id)
                        .then(found => {
                            if (!found) {
                                res.status(404).json({
                                    msg: `User not found`
                                })
                            } else {
                                next()
                            }
                        })
                        .catch(err => {
                            res.status(500).jsoon({
                                msg: `Internal server error`,
                                error: err.message
                            })
                        })
                }

            } catch(err) {
                res.status(400).json({
                    msg: `Invalid token`,
                    error: err.message
                })
            }
        }
    }
}