module.exports = {
	port: 3000,
	session: {
		secret: 'blog',
		key: 'blog',
		maxAge: 2480000
	},
	mongodb: 'mongodb://localhost:27017/blog'
}