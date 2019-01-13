const axios = require('axios')
const Task = require('../models/Task')

class SpeechController {
    static read(req, res) {
        axios({
            method: "get",
            url: `http://api.voicerss.org/?key=${process.env.SPEECH}&hl=en-us&src=${req.headers.text}&b64=true`
        })
        .then(response => {
            res.status(200).json({
                data: response.data
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
module.exports = SpeechController