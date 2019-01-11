const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    task: {
        type: String,
        required: [true, `task must be filled`]
    },
    description: {
        type: String,
        required: [true, `Please fill task description`]
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date
    }
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task