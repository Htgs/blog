const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const config = require('config-lite')(__dirname)

const mongoose = require('mongoose')
mongoose.connect(config.mongodb)
const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error'))
// db.once('open', function (callback) {
// 	console.log('this is cb', callback)
// })

const userSchema = new mongoose.Schema({
	name: String,
	password: String,
	avater: { type: String, default: null },
	gender: { type: Number, default: 0 },
	bio: { type: String, default: null },
	created_at: { type: Date, default: Date.now },
	deleted_at: { type: Date, default: null },
	changed_at: { type: Date, default: null }
})
userSchema.index({ name: -1 })

// Schema.add(obj, prefix)
// userSchema.add({ djs: { type: String, default: 'djs' } }, 'pre-')
userSchema.methods.speak = function () {
	let greeting = this.name
	? 'my name is ' + this.name
	: 'no name'
	console.log(greeting)
}

const UserModel = mongoose.model('User', userSchema)

// let theone = new User({ name: 'theone' })
// // console.log(theone.name)

// let flys = new User({ name: 'flys' })
// // flys.speak()
// flys.save(function (err, flys) {
// 	if (err) return console.error(err)
// 	flys.speak()
// })



// User.remove(function (err, ts) {
// 	if (err) return console.error(err)
// 	console.log(ts)
// })

let admin = new UserModel({
	name: 'bsa',
	password: 'bsa',
	gender: 0,
})

admin.save(function (err, admin) {
	if (err) return console.error(err)
	console.log(admin)
})

// UserModel.update({ name: 'admin' }, { $set : { gender : 2 }}, function (err) {
// 	if (err) return console.error(err)
// })

// UserModel.remove({ _id: '593111aeab0bc711fc544488' },function (err) {
// 	if (err) return console.error(err)
// })

// find(Conditions,field,callback)
// "$lt"(小于)，
// "$lte"(小于等于),
// "$gt"(大于)，
// "$gte"(大于等于)，
// "$ne"(不等于)，
// "$in"(可单值和多个值的匹配)，
// "$or"(查询多个键值的任意给定值)，
// "$exists"(表示是否存在的意思)
// "$all"
// limit为限制多少条
// skip为跳过多少条
// sort为排序， 1为正序， -1为逆序
// UserModel.find({ gender: { '$gt' : 0 } }, function (err, thss) {
// UserModel.find({}, null, { limit: 2 }, function (err, thss) {
// UserModel.find({}, null, { skip: 1 }, function (err, thss) {
// UserModel.find({}, null, { sort: { gender: -1 } }, function (err, thss) {
UserModel.find(function (err, thss) {
	if (err) return console.error(err)
	console.log(thss)
})

// findOne(Conditions,callback);
// UserModel.findOne({ gender: 2 }, function (err, thss) {
// 	if (err) return console.error(err)
// 	console.log(thss)
// })

// findById(_id, callback);
// UserModel.findById( '593111893b33a71740273369', function (err, thss) {
// 	if (err) return console.error(err)
// 	console.log(thss)
// })

