const marked = require('marked')
const Comment = require('../lib/mongo').Comment

Comment.plugin('contentToHtml', {
	afterFind: function (comment) {
		return comment.map(function (comment) {
			comment.content = marked(article.comment)
			return comment
		})
	},
})

module.exports = {
	create: function (comment) {
		return Comment.create(comment).exec()
	},
	getCommentsByArticleId: function (articleId) {
		return Comment
			.find({ articleId: articleId })
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: 1 })
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},
	getCommentsCountByArticleId: function (articleId) {
		return Comment.count({ articleId: articleId }).exec()
	},
	deleteCommentsByArticleId: function (articleId) {
		return Comment.remove({ articleId: articleId }).exec()
	},
	deleteCommentsById: function (commentId, author) {
		return Comment.remove({ _id: commentId, author: author }).exec()
	},
}
