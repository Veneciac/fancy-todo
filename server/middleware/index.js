const decode = require('../helper').decode
const User = require('../models/User')
const mongoose = require('mongoose')
const Task = require('../models/Task')
const ObjId = require('mongoose').Types.ObjectId

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
                                req.currentUser = id
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
    }, 
    //belom bisa jadi langsung cek di controller task delete
    checkPerson: function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            Task.findById(req.params.id)
                .then(task => {
                    console.log(`masuk middleware check person`, task.userId)
                    if (req.currentUser !== task.userId) {
                        res.status(403).json({
                            msg: `You are not authorized`
                        })
                    } else {
                        next()
                    }
                })
                .catch(err => {
                    console.log(`masuk middleware error`)
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })

        } else {
            res.status(400).json({
                msg: `Id is not valid`
            })
        }
    }
}