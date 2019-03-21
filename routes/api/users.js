// login & register

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const keys = require('../../config/keys')
const passport = require('passport')

const User = require('../../models/User')

// $route   GET api/users/test
// @desc    返回请求的json数据
// @access  public
router.get('/test', (req, res) => {
    res.json({ msg: "users works" })
})


router.post('/register', (req, res) => {
    // console.log(req.body);

    // 查询数据库中是否有该邮箱
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: "邮箱已被注册" })
            } else {
                let avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        } else {
                            newUser.password = hash;

                            newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err))
                        }
                    })
                })
            }
        })
})

// $route   POST api/users/login
// @desc    返回token jwt passport
// @access  public
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    // 查询数据库
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ msg: "用户不存在" })
            } else {
                // 密码匹配
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = { id: user.id, name: user.name ,avatar:user.avatar}
                            jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
                                res.json({ success: true, token: "Bearer " + token })
                            })

                            // res.json({ msg: '登陆成功' })
                        } else {
                            return res.status(400).json({ msg: "用户名或密码错误" })
                        }
                    })
            }
        })
})

// $route   GET /api/users/current
// @desc    return current user
// @access  private
router.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar:req.user.avatar
    })

})

module.exports = router