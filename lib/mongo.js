const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

mongolass.plugin('addCreatedAt', {
	afterFind: function (results) {
		debugger;
		results.forEach(function (item) {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
		})
		return results
	},
	afterFindOne: function (result) {
		if (result) {
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		}
		return result
	}
})



exports.User = mongolass.model('User', {
	name: { type: 'string' },
	password: { type: 'string' },
	avatar: { type: 'string' },
	gender: { type: 'string', enum: ['m', 'f', 'x'] },
	bio: { type: 'string' }
})
exports.User.index({ name: 1 }, { unique: true }).exec()

exports.Article = mongolass.model('Article', {
	author: { type: Mongolass.Types.ObjectId },
	title: { type: 'string' },
	content: { type: 'string' },
	pv: { type: 'number' } // 点击量
})
exports.Article.index({ author: 1, _id: -1 }).exec()

exports.Comment = mongolass.model('Comment', {
	author: { type: Mongolass.Types.ObjectId },
	articleId: { type: Mongolass.Types.ObjectId },
	content: { type: 'string' }
})
exports.Comment.index({ articleId: 1, _id: 1 }).exec()
exports.Comment.index({ author: 1, _id: 1 }).exec()

