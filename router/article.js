const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check.js').checkLogin

// 请求文章页
router.get('/', checkLogin, (req, res, next) => {
	// res.send(req.flash())
    res.render('home')  
})

// 提交请求发表文章
router.put('/', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

// 请求发表文章页
router.get('/create', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

// 看文章
router.get('/:articleId', (req, res, next) => {
	res.send(req.flash())
})

// 修改文章页
router.get('/:articleId/edit', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

// 修改文章
router.post('/:articleId/edit', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

// 删除文章
router.delete('/:articleId', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

// 发表留言
router.post('/:articleId/comment', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

router.delete('/:articleId/comment/:commentId', checkLogin, (req, res, next) => {
	res.send(req.flash())
})

module.exports = router
