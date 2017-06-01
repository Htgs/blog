const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check.js').checkLogin

// 登出
router.get('/', checkLogin, (req, res, next) => {
    req.session.user = null
	req.flash('success', '登出成功')
    res.redirect('/signin')
})

module.exports = router
