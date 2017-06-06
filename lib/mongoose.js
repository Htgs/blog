const config = require('config-lite')(__dirname)

const mongoose = require('mongoose')
mongoose.connect(config.mongodb)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
// db.once('open', function (callback) {
// 	console.log('this is cb', callback)
// })
const Schema = mongoose.Schema


const UserSchema = new Schema({
	name: String,
	password: String,
	avater: { type: String, default: null },
	gender: { type: String, enum: ['m', 'f', 'x'] },
	bio: { type: String, default: null },
	created_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	changed_at: { type: Date, default: null }
})
// userSchema.methods.speak = function () {
// 	let greeting = this.name
// 	? 'my name is ' + this.name
// 	: 'no name'
// 	console.log(greeting)
// }
const User = mongoose.model('User', UserSchema)
exports.User = User
// exports.User.index({ name: 1 }, { unique: true }).exec()


const ArticleSchema = new Schema({
	author: Schema.Types.ObjectId,
	title: String,
	content: String,
	pv: { type: Number, default: 0 },
	created_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	changed_at: { type: Date, default: null }
})
// ArticleSchema.statics.getArticleById = function (articleId) {
// 	return this.model('Article')
// 		.findOneAndUpdate({ _id: articleId }, { $inc: { pv: 1 } })
// 		.populate({ path: 'author', model: 'User', select: ['name', 'avater'] })
// }
const Article = mongoose.model('Article', ArticleSchema)
// Article.getArticleById('5934f5fda1e8161b14679f50')
// 	.then(function (result) {
// 		console.log(result)
// 	})
// 	.catch()
exports.Article = Article
// exports.Article.index({ created_at: -1 }).exec()


const CommentSchema = new Schema({
	author: Schema.Types.ObjectId,
	articleId: Schema.Types.ObjectId,
	content: String,
	created_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	changed_at: { type: Date, default: null }
})

const Comment = mongoose.model('Comment', CommentSchema)
exports.Comment = Comment
// exports.Comment.index({ created_at: -1 }).exec()


const AdminUserSchema = new Schema({
	user: String,
	realname: String,
	password: String,
	role: { type: Number, default: 0 },
	created_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	changed_at: { type: Date, default: null }
})

const AdminUser = mongoose.model('AdminUser', AdminUserSchema)
exports.AdminUser = AdminUser
