const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    count: {
        type: Number
    },

    // 当前登录用户的id
    user_id: {
        type: String,
        required: true
    },

    message: [
        {
            // source为'self'代表该消息为自己发给对方的，'other'为对方发给自己的
            source: {
                type: String,
                required: true
            },
            msg: {
                type: String,
                required: true
            }
        }
    ],

    // 聊天对象的信息
    target: {
        avatar: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        _id: {
            type: String,
            required: true
        }
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Message = mongoose.model('message', MessageSchema)