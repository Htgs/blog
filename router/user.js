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
	res.render('setting')
})

router.post('/setting', checkLogin, (req, res, next) => {
	// res.send(req.files)
	// {"gender":"m","bio":"fdas"}
	// {
	// 	"avatar":
	// 	{
	// 		"size":2846,
	// 		"path":"F:\\szh\\blog\\public\\img\\upload_74e58c7599d555a24ea35070def9b2be.png",
	// 		"name":"资源 1.png",
	// 		"type":"image/png",
	// 		"mtime":"2017-06-06T09:46:34.437Z"
	// 	}
	// }
	let userid = req.session.user._id
	let gender = req.fields.gender
	let bio = req.fields.bio
	let avater = req.files.avater
	try {
		if (avater.type.indexOf('png') < 0 && avater.type.indexOf('jpeg') < 0) {
			throw new Error('文件类型不正确')
		}
		if (avater.size / 1024 > 50) {
			throw new Error('图片不能超过50kb')
		}
	} catch (e) {
		fs.unlink(avater.path)
		req.flash('error', e.message)
		res.redirect('back')
	}
	let setting = {
		gender: gender,
		bio: bio,
		avater: avater.path.split(path.sep).pop(),
		changed_at: Date.now()
	}
	User.settingById(userid, setting)
		.then(function (result) {
			req.flash('success', '修改成功')
			res.redirect('/user/setting')
		})
		.catch(next)
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
