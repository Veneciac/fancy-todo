const Task = require('../models/Task')
const ObjId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')

class TaskController { 
    static findAll (req, res) {
        Task.find({})
            .then(list => {
                if (req.query.search) {
                    let query = req.query.search.toLowerCase()
                    let q = new RegExp(query)
                    
                    list = list.filter(function (el) {
                        return el.task.toLowerCase().match(q)
                    })
                }
                res.status(200).json({
                    msg: `Success getting all task`,
                    data: list
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'Internal server error' ,
                    error: err.message
                })
            })
    }

    static findOne (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.tatus(400).json({
                msg: `Task id is not valid`
            })
        } else {
            Task.findById(req.params.id) 
                .then(found => {
                    if (!found) {
                        res.status(404).json({
                            msg: `Task not found`
                        })
                    } else {
                        res.status(200).json({
                            msg: `Success getting task`,
                            data: found
                        })
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
    }

    static create (req, res) {
        let task = req.body.task
        let description = req.body.description
        let userId = req.body.userId
        let dueDate = new Date(req.body.dueDate) 

        if (!task || !description || !userId) {
            res.status(400).json({
                msg: `Please input required data`
            })
        } else {
            if (mongoose.Types.ObjectId.isValid(userId)) {
                let newTask = {
                    task,
                    description,
                    userId
                }
                Task.create(newTask)
                    .then(created => {
                        res.status(201).json({
                            msg: `Success create task`,
                            data: created
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            msg: `Internal server error`
                        })
                    })
            } else {
                res.status(400).json({
                    msg: `User id is invalid`
                })
            }
        }
    }

    static update (req, res) {
        let id = req.params.id
        let task = req.body.task
        let description = req.body.description
        let status = req.body.status
        let dueDate = req.body.dueDate

        let upTask = {
            task,
            description,
            status,
            dueDate
        }

        for (let i in upTask) {
            if (!upTask[i]) delete upTask[i]
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                msg: `Task id is invalid`
            })
        } else {
            Task.findById(id)
                .then(found => {
                    if (!found) {
                        res.status(400).json({
                            msg: `Task not found`
                        })
                    } else {
                        found.set(upTask)
                        return found.save()
                    }
                })
                .then(updated => {
                    res.status(200).json({
                        msg: `Task updated`,
                        data: updated
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

    static delete (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({
                msg: 'Task id is not defined'
            })
        } else {
            Task.findById(req.params.id)
                .then(found => {
                    if (!found) {
                        res.status(404).json({
                            msg: `Task not found`
                        })
                    } else {
                        return found.remove()
                    }
                })
                .then(del => {
                    res.status(200).json({
                        msg: `Success delete task`
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

}

module.exports = TaskController