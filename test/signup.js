const assert = require('assert')
const supertest = require('supertest')
const app = require('../index')
const User = require('../lib/mongo').User

const testName1 = 'testName1'
const testName2 = 'testbbb'
describe('signup', function () {
	describe('POST /signup', function () {
		let agent = supertest.agent(app)
		beforeEach(function (done) {
			User.create({
				name: testName1,
				password: '123456'
			})
			.exec()
			.then(function () {
				done()
			})
			.catch(done)
		})
		afterEach(function (done) {
			User.remove({ name: { $in: [testName1, testName2] } })
				.exec()
				.then(function () {
					done()
				})
				.catch(done)
		})

		it('wrong name', function(done) {
			agent
				.post('/signup')
				.type('form')
				.field({name: ''})
				.redirects()
				.end(function (err, res) {
					if (err) return done(err)
					assert(res.text.match(/名字请限制在 1-10 个字符/))
					done()
				})
		})

		it('duplicate name', function(done) {
			agent
				.post('/signup')
				.type('form')
				.field({ name: testName1, password: '123456', repassword: '123456' })
				.redirects()
				.end(function (err, res) {
					if (err) return done(err)
					assert(res.text.match(/用户名已被占用/))
					done()
				})
		})

		it('success', function(done) {
			agent
				.post('/signup')
				.type('form')
				.field({ name: testName2, password: '123456', repassword: '123456' })
				.redirects()
				.end(function (err, res) {
					if (err) return done(err)
					assert(res.text.match(/注册成功/))
					done()
				})
		})

	})
})
