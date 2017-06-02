const express = require('express')
const router = express.Router()

const Article = require('../models/article')
const Comment = require('../models/comment')
const checkLogin = require('../middlewares/check.js').checkLogin

// 请求文章页
router.get('/', checkLogin, (req, res, next) => {
	// res.send(req.flash())
	let query = req.query.author
	Article.getArticles(query)
		.then(function (result) {
			// res.send(result)
			// [
			// 	{"_id":"592fbcafad403b0e08d68267","author":{"_id":"592f6a7883e98c1508ac8a82","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"title":"888","content":"<p>433</p>\n","pv":2,"created_at":"2017-06-01 15:05"},
			// 	{"_id":"592fb67cd168b90ad441a498","author":{"_id":"592f6a7883e98c1508ac8a82","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"title":"测试","content":"<p>8888</p>\n","pv":33,"created_at":"2017-06-01 14:38"},
			// 	{"_id":"592faa58a872bd15dce8f051","author":{"_id":"592f6a7883e98c1508ac8a82","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"title":"555","content":"<p>334</p>\n","pv":4,"created_at":"2017-06-01 13:47"},
			// 	{"_id":"592f90ba623f861b88e5c381","author":{"_id":"592f6a7883e98c1508ac8a82","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"title":"sa","content":"<p>fe</p>\n","created_at":"2017-06-01 11:57"},
			// 	{"_id":"592f8b9aa0fcaa1848b3212b","author":{"_id":"592f6a7883e98c1508ac8a82","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"title":"sa","content":"<p>fe</p>\n","created_at":"2017-06-01 11:35"}
			// ]
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
	// res.send(req.fields)
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
		pv: 0
	}

	Article.create(article)
		.then(function (result) {
			// res.send(result)
			article = result.ops[0]
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
		Article.incPv(articleId),
	])
	.then(function (result) {
		// res.send(result)
		// [
		// 	{"_id":"59302abe3bc9dc045051fb85","author":{"_id":"5930293e5993c71590500065","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"title":"gsagsadsfdsa","content":"<p>fewfas</p>\n","pv":4,"created_at":"2017-06-01 22:54","commentsCount":3},
		// 	[
		// 		{
		// 			"_id":"59302ac73bc9dc045051fb86",
		// 			"author":{"_id":"5930293e5993c71590500065","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},
		// 			"articleId":"59302abe3bc9dc045051fb85",
		// 			"content":"<p>test 1</p>\n",
		// 			"created_at":"2017-06-01 22:55"
		// 		},
		// 		{"_id":"59302ad33bc9dc045051fb87","author":{"_id":"5930293e5993c71590500065","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"articleId":"59302abe3bc9dc045051fb85","content":"<p>fdsa</p>\n","created_at":"2017-06-01 22:55"},
		// 		{"_id":"59302adc3bc9dc045051fb88","author":{"_id":"5930293e5993c71590500065","name":"test","password":"7c4a8d09ca3762af61e59520943dc26494f8941b"},"articleId":"59302abe3bc9dc045051fb85","content":"<p>asad</p>\n","created_at":"2017-06-01 22:55"}
		// 	]
		// 	,{"n":1,"nModified":1,"ok":1}
		// ]
		let article = result[0]
		let comments = result[1]
		if (!article) {
			throw new Error('该文章不存在')
		}
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
			comment = result.ops[0]
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
