const express = require('express')
const router = express.Router()
const passport = require('passport')
const Message = require('../../models/Message')

// $router  POST /api/message/addmsg
// @desc    添加消息记录
// @access  private
router.post('/addmsg', passport.authenticate('jwt', { session: false }), (req, res) => {
    Message.findOne({
        target: req.body.target, user_id: req.body.user_id
    })
        .then(msg => {
            if (!msg) { // 还从未和这个人聊过天
                const messageFields = {}
                if (req.body.target) {
                    messageFields.target = req.body.target
                }
                if (req.body.user_id) {
                    messageFields.user_id = req.body.user_id
                }
                messageFields.count = req.body.count
                if (req.body.message) {
                    messageFields.message = req.body.message
                }
                new Message(messageFields).save()
                    .then(msg => res.json(msg))
            } else {
                msg.message = req.body.message
                msg.count = req.body.count
                msg.save()
                    .then(msg => res.json(msg))
            }
        })
})

// $route   GET /api/message/msg/:user_id
// @desc    获取user_id用户的所有消息记录
// @access  private
router.get('/msg/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Message.find()
        .then(msgs => {
            if (!msgs) {
                res.status(404).json({ errmsg: '没有任何消息' })
            } else {
                let result = msgs.filter(msg => msg.user_id == req.params.user_id)
                res.json(result)
            }
        })
        .catch(err => res.status(404).json(err))
})

module.exports = router;