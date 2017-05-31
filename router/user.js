const express = require('express')
const router = express.Router()

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
router.post('/signup', checkNotLogin, (req, res, next) => {
	res.send(req.flash())
})

// 请求登录页
router.get('/signin', checkNotLogin, (req, res, next) => {
	// res.send()
	res.render('signin')
})

// 提交登录信息
router.post('/signin', checkNotLogin, (req, res, next) => {
	res.send(req.flash())
})

// 登出
router.get('/signout', checkNotLogin, (req, res, next) => {
	res.send(req.flash())
})

module.exports = router
