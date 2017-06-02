const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/user.js')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin

// router.get('/:name', function(req, res) {
// 	res.render('users', {
// 		name: req.params.name,
// 		port: 2222
// 	})
// })

// 请求登录页
router.get('/', checkNotLogin, (req, res, next) => {
	res.render('signin')
})

// 提交登录信息
router.post('/', checkNotLogin, (req, res, next) => {
    let username = req.fields.username
    let password = req.fields.password

    UserModel.getUserByName(username)
        .then(function (user) {
            // res.send(user)
            if (!user) {
                req.flash('error', '用户不存在')
                return res.redirect('back')
            }
            if (sha1(password) !== user.password) {
                req.flash('error', '密码错误')
                return res.redirect('back')
            }
            req.flash('success', '登录成功')
            delete user.password
            req.session.user = user
            res.redirect('/article')
        })
        .catch(next)
})

module.exports = router
