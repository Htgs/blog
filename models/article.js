const marked = require('marked')
const Article = require('../lib/mongo').Article
const Comment = require('./comment')

Article.plugin('addCommentsCount', {
	afterFind: function (articles) {
		return Promise.all(articles.map(function (article) {
			return Comment.getCommentsCountByArticleId(article._id)
				.then(function (commentsCount) {
					article.commentsCount = commentsCount
					return article
				})
		}))
	},
	afterFindOne: function (article) {
		if (article) {
			return Comment.getCommentsCountByArticleId(article._id)
				.then(function (commentsCount) {
					article.commentsCount = commentsCount
					return article
				})
		}
		return article
	}
})

Article.plugin('contentToHtml', {
	afterFind: function (articles) {
		return articles.map(function (article) {
			article.content = marked(article.content)
			return article
		})
	},
	afterFindOne: function (article) {
		if (article) {
			article.content = marked(article.content)
		}
		return article
	}
})

module.exports = {
	create: function (article) {
		return Article.create(article).exec()
	},
	getArticleById: function (articleId) {
		return Article
			.findOne({ _id: articleId })
			.populate({ path: 'author', model: 'User'})
			.addCreatedAt()
			.addCommentsCount()
			.contentToHtml()
			.exec()
	},
	getArticles: function (author) {
		let query = {}
		if (author) {
			query.author = author
		}
		return Article
			.find(query)
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: -1 })
			.addCreatedAt()
			.addCommentsCount()
			.contentToHtml()
			.exec()
	},
	incPv: function (articleId) {
		return Article
			.update({ _id: articleId }, { $inc: { pv: 1 } })
			.exec()
	},
	// 获取编辑数据
	getRawArticleById: function (articleId) {
		return Article
			.findOne({ _id: articleId })
			.populate({ path: 'author', model: 'User' })
			.exec()
	},
	// 保存编辑数据
	updateArticleById: function (articleId, author, data) {
		return Article.update({ author: author, _id: articleId }, { $set: data }).exec()
	},
	deleteArticleById: function (articleId, author) {
		return Article
			.remove({ author: author, _id: articleId })
			.exec()
			.then(function (result) {
				if (result.result.ok && result.result.n > 0) {
					// console.log(result)
					return Comment.deleteCommentsByArticleId(articleId)
				}
			})
	}
}
