const marked = require('marked')
const Comment = require('../lib/mongoose').Comment

Comment.plugin('contentToHtml', {
	afterFind: function (comment) {
		return comment.map(function (comment) {
			comment.content = marked(comment.content)
			return comment
		})
	},
})

module.exports = {
	create: function (comment) {
		return Comment.create(comment)
	},
	getCommentsByArticleId: function (articleId) {
		return Comment
			.find({ articleId: articleId })
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: 1 })
			.contentToHtml()
	},
	getCommentsCountByArticleId: function (articleId) {
		return Comment.count({ articleId: articleId })
	},
	deleteCommentsByArticleId: function (articleId) {
		return Comment.remove({ articleId: articleId })
	},
	deleteCommentsById: function (commentId, author) {
		return Comment.remove({ _id: commentId, author: author })
	},
}
