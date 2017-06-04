const moment = require('moment')

const express = require('express')
const router = express.Router()

const Article = require('../models/article')
const Comment = require('../models/comment')
const checkLogin = require('../middlewares/check.js').checkLogin

// 请求文章页
router.get('/', checkLogin, (req, res, next) => {
	let query = req.query.author
	Article.getArticles(query)
		.then(function (result) {
			// console.log(result)
			let articles = result
			articles.forEach(function (item) {
				item.created_time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
			})
			res.render('articles', {
				articles: result
			})
		})
		.catch(next)
})

// 请求发表文章页
router.get('/create', checkLogin, (req, res, next) => {
	res.render('create', {
		article: {
			url: './',
			title: '',
			content: null
		}
	})
})

// 提交请求发表文章
router.post('/', checkLogin, (req, res, next) => {
	let author = req.session.user._id
	let title = req.fields.title
	let content = req.fields.content

	try {
		if (!title.length) {
			throw new Error('缺少标题')
		}
		if (!content) {
			throw new Error('缺少内容')
		}
	}
	catch (e) {
		req.flash('error', e.message)
		return res.redirect('back')
	}

	let article = {
		author: author,
		title: title,
		content: content,
	}

	Article.create(article)
		.then(function (result) {
			// res.send(result)
			article = result
			req.flash('success', '发表成功')
			res.redirect(`/article/${article._id}`)
		})
		.catch(next)
})

// 看文章
router.get('/:articleId', (req, res, next) => {
	let articleId = req.params.articleId
	Promise.all([
		Article.getArticleById(articleId),
		Comment.getCommentsByArticleId(articleId),
		// Article.incPv(articleId),
	])
	.then(function (result) {
		// res.send(result)
		let article = result[0]
		let comments = result[1]
		if (!article) {
			throw new Error('该文章不存在')
		}
		comments.forEach(function (item) {
			item.created_time = moment(item.created_at).format('YYYY-MM-DD HH:mm')
		})
		res.render('article', {
			article: article,
			comments: comments
		})
	})
	.catch(next)
})

// 修改文章页
router.get('/:articleId/edit', checkLogin, (req, res, next) => {
	let articleId = req.params.articleId
	let author = req.session.user._id
	Article.getRawArticleById(articleId)
		.then(function (result) {
			// res.send(result)
			// {"_id":"592fc26a7f1b02147c875ca7","author":{"_id":"592fc25a7f1b02147c875ca6","name":"666","password":"77bce9fb18f977ea576bbcd143b2b521073f0cd6"},"title":"888","content":"sasfe","pv":7}
			let article = result
			if (!article) {
				throw new Error('该文章不存在')
			}
			if (author.toString() !== article.author._id.toString()) {
				throw new Error('权限不足')
			}
			article['url'] = `./edit`
			res.render('create', {
				article: article
			})
		})
		.catch(next)
})

// 修改文章
router.post('/:articleId/edit', checkLogin, (req, res, next) => {
	let articleId = req.params.articleId
	let author = req.session.user._id
	let title = req.fields.title
	let content = req.fields.content
	Article.updateArticleById(articleId, author, { title: title, content: content })
		.then(function (result) {
			// res.send(result)
			// {"n":1,"nModified":0,"ok":1} //没有改变
			// {"n":1,"nModified":1,"ok":1} //改变后
			
			// if (result.ok == 1) {
				req.flash('success', '保存成功')
				res.redirect(`/article/${articleId}`)
			// }
			// else {
			// 	req.flash('error', '保存失败')
			// 	res.send(result)
			// }
		})
		.catch(next)
})

// 删除文章
router.get('/:articleId/delete', checkLogin, (req, res, next) => { 
	let articleId = req.params.articleId
	let author = req.session.user._id
	Article.deleteArticleById(articleId, author)
		.then(function (result) {
			// res.send(result)
			// {"n":0,"ok":1}
			// {"n":1,"ok":1}
			req.flash('success', '删除成功')
			res.redirect(`/article`)
		})
		.catch(next)
})

// 发表留言
router.post('/:articleId/comment', checkLogin, (req, res, next) => {
	// res.send(req.flash())
	let author = req.session.user._id
	let articleId = req.params.articleId
	let content = req.fields.content
	let comment = {
		author: author,
		articleId: articleId,
		content: content
	}
	Comment.create(comment)
		.then(function (result) {
			// res.send(result)
			// {"result":{"ok":1,"n":1},"ops":[{"author":"592f6a7883e98c1508ac8a82","articleId":"592fbcafad403b0e08d68267","content":"但是","_id":"592fe4bed1eeb61088d6d1f0"}],"insertedCount":1,"insertedIds":[null,"592fe4bed1eeb61088d6d1f0"]}
			comment = result
			req.flash('success', '评论成功')
			res.redirect('back')
		})
		.catch(next)
})

router.get('/:articleId/comment/:commentId/delete', checkLogin, (req, res, next) => {
	let commentId = req.params.commentId
	let author = req.session.user._id
	Comment.deleteCommentsById(commentId, author)
		.then(function (result){
			req.flash('success', '删除留言成功')
			res.redirect('back')
		})
		.catch(next)
})

module.exports = router
