const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const app = express()

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

// api users
const users = require('./routes/api/users')
// api profiles
const profiles = require('./routes/api/profiles')
// api message
const messages = require('./routes/api/messages')

// passport middleware
app.use(passport.initialize())
require('./config/passport')(passport)


// 数据库配置
const db = require('./config/keys').mongoURI
// 连接数据库
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB 连接成功')
    })
    .catch(err => console.log(err))


app.use('/api/users', users)
app.use('/api/profiles', profiles)
app.use('/api/messages', messages)

app.listen(5000, () => console.log('Server listening on port 5000'))