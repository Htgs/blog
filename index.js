const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const router = require('./router')
const pkg = require('./package')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(session({
	name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	resave: true,// 强制更新 session
	saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
	cookie: {
		maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
	},
	store: new MongoStore({// 将 session 存储到 mongodb
		url: config.mongodb// mongodb 地址
	})
}))

app.use(flash())

app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'public/img'),
	keepExtensions: true
}))


app.locals.blog = {
	title: pkg.name,
	subTitle: 'hhhhh',
	description: pkg.description
}

app.use(function (req, res, next) {
	res.locals.user = req.session.user
	res.locals.success = req.flash('success').toString()
	res.locals.error = req.flash('error').toString()
	next()
})

router(app)

app.listen(config.port, () => {
	console.log(`${pkg.name} listening on port ${config.port}`)
})
