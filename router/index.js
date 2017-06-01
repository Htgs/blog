// const path = require('path')
// const fs = require('fs')

module.exports = (app) => {
	app.get('/', (req, res) => {
		// fs.readFile(path.join(process.cwd(), '/views/index.html'), 'utf8', (err, data) => {
		// 	if (err) throw err
		// 	res.send(data)
		// })
		res.redirect('/article')
	})
	// app.use('/user', require('./user'))
	app.use('/signup', require('./signup'))
	app.use('/signin', require('./signin'))
	app.use('/signout', require('./signout'))
	app.use('/article', require('./article'))

	app.use((req, res) => {
		if (!res.headersSent) {
			res.status(404).send('404')
		}
	})
}

