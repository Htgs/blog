const fs = require('fs')
const path = require('path')
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

// 请求注册页
router.get('/signup', checkNotLogin, (req, res, next) => {
	// res.send(req.flash())
	res.render('signup')
})

// 提交注册信息
// 设置在这里会无法post到 /user/signup
router.post('/signup', checkNotLogin, (req, res, next) => {
    // res.send(req.flash())
    let username = req.fields.username
    let password = req.fields.password
    let repassword = req.fields.repassword
    try {
        if (!(username.length >= 1 && username.length <= 10)) {
            throw new Error('名字请限制在 1-10 个字符');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('/signup')
    }
    password = sha1(password)
    let user = {
        name: username,
        password: password
    }
    UserModel.create(user)
        .then(function (result) {
            user = result.ops[0]
            delete user.password
            req.session.user = user
            req.flash('success', '注册成功')
            res.send(1)
            // res.redirect('/article')
        })
        .catch(function (e) {
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '用户名已被占用')
                return res.send(0)
                // return res.redirect('/user/signup')
            }
            next(e)
        })
})

// 请求登录页
router.get('/signin', checkNotLogin, (req, res, next) => {
	// res.send()
	res.render('signin')
})

// 提交登录信息
router.post('/signin', checkNotLogin, (req, res, next) => {
	// res.send(req.flash())
    console.dir(req)
    console.dir(res)

})

// 登出
router.get('/signout', checkNotLogin, (req, res, next) => {
	res.send(req.flash())
})

module.exports = router
