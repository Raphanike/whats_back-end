const express = require('express')
const Message = require('../models/message')
const router = express.Router()

router.get('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params

    const messages = await Message.find({
        $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
        ]
    }).sort('timestamp')

    res.json(messages)
})

module.exports = router
