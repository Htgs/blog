const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const checkLogin = require('../middlewares/check.js').checkLogin

// router.get('/:name', function(req, res) {
// 	res.render('users', {
// 		name: req.params.name,
// 		port: 2222
// 	})
// })

router.get('/setting', checkLogin, (req, res, next) => {
	// res.send(req.flash())
	res.render('setting')
})

router.get('/password', checkLogin, (req, res, next) => {
	// res.send(req.flash())
	res.render('password')
})

router.post('/password', checkLogin, (req, res, next) => {
	// res.send(req.flash())
	// res.render('password')
	let userid = req.session.user._id
	let npassword = req.fields.npassword
	let renpassword = req.fields.renpassword

	try {
		if (npassword.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (npassword !== renpassword) {
            throw new Error('两次输入密码不一致');
        }
	}
	catch (e) {
		req.flash('error', e.message)
		res.redirect('back')
	}

	npassword = sha1(npassword)

	User.passwordById(userid, npassword)
		.then(function (result) {
			// res.send(result)
			// {"n":1,"nModified":1,"ok":1}
			req.flash('success', '修改成功')
			res.redirect('/user/password')
		})
		.catch(next)
})


module.exports = router
