const User = require('../models/User')
const ObjId = require('mongoose').Types.ObjectId
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken')
const compare = require('../helper').compare

class UserController {
    static signIn (req, res) {
        client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.CLIENT_ID
        }, function(err, ticket) {
            if (err) {
                res.status(500).json({
                    msg: `Error get ticket google`,
                    err
                })
            } else {
                const payload = ticket.getPayload();
                
                User.findOne({email: payload.email})
                    .then(found => {
                        if (found) {
                            res.status(200).json({
                                msg: `Success sign old user`,
                                token: jwt.sign({id: found._id}, process.env.JWT)
                            })
                        } else {
                            let newUSer = {
                                name: payload.name,
                                email: payload.email,
                                google: true
                            }
                            return User.create(newUSer)
                        }
                    })
                    .then(created => {
                        res.status(201).json({
                            msg: `Success sign in and create user`,
                            token: jwt.sign({id: created._id}, process.env.JWT)
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            msg: 'Internal server error',
                            errror: err
                        })
                    })

            }
        })
    }

    static login (req, res) {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({
                msg: `Please input all data!`
            }) 
        } else {
            User.findOne({email: req.body.email}) 
                .then(found => {
                    if (found) {
                        if (!compare(req.body.password, found.password)) {
                            res.status(400).json({
                                msg: `Wrong password`
                            })
                        } else {
                            res.status(200).json({
                                msg: `Success sign in`,
                                token: jwt.sign({id: found._id}, process.env.JWT)
                            })
                        }
                    } else {
                        // return User.create({email: req.body.email, password: req.body.password, google: false })
                      res.status(404).json({
                          msg: `Please register first`
                      })
                    }
                })
                // .then(user => {
                //     res.status(201).json({
                //         msg: `Success create User`,
                //         data: user,
                //         token: jwt.sign({id: user._id}, process.env.JWT)
                //     })
                // })
                .catch(err => {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
    }

    static create (req, res) {
        if ( !req.body.email || !req.body.password) {
            res.status(400).json({
                msg: `Please input all data!`
            })
        } else {
            let newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                google: false
            }
            User.create(newUser)
                .then(user => {
                    res.status(201).json({
                        msg: `Success create User`,
                        data: user,
                        token: jwt.sign({id: user._id}, process.env.JWT)
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
    }


    static update (req, res) {
        let dataUser = {
            email: req.body.email,
            password: req.body.password
        }

        for (let i in dataUser) {
            if (!dataUser[i]) delete dataUser[i]
        }

        User.findById(req.params.id)
            .then(found => {
                if (!found) {
                    res.status(404).json({
                        msg: `User not found`
                    })
                } else {
                    found.set(dataUser)
                    return found.save()
                }
            })
            .then(updated => {
                res.status(200).json({
                    msg: `Success update user data`,
                    data: updated
                })
            })
            .catch(err => {
                if(err.message == 'CastError') {
                    res.status(400).json({
                        msg: `Id invalid`
                    })
                } else {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                }
            })
            
    }

    static delete (req, res) {
        User.findById(req.params.id) 
            .then(found => {
                if (!found) {
                    res.status(404).json({
                        msg: `User not found`
                    })
                } else {
                    return found.remove()
                }
            })
            .then(del => {
                res.status(200).json({
                    msg: `Success delete user`
                })
            })
            .catch(err => {
                if(err.message == 'CastError') {
                    res.status(400).json({
                        msg: `Id invalid`
                    })
                } else {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                }
            })
            
    }

    static findOne (req, res) {
        User.findById(req.params.id)
            .then(found => {
                if (!found) {
                    res.status(404).json({
                        msg: `User not found`
                    })
                } else {
                    res.status(200).json({
                        msg: `Success getting user`,
                        data: found
                    })
                }
            })
            .catch(err => {
                if(err.message == 'CastError') {
                    res.status(400).json({
                        msg: `Id invalid`
                    })
                } else {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })

                }
            })
    }
}
module.exports = UserController