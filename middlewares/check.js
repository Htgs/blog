module.exports = {
	checkLogin: (req, res, next) => {
		if (!req.session.user) {
			req.flash('error', '未登录')
			if (res.locals.admin) {
				return res.redirect('/adminuser')
			} else {
				return res.redirect('/signin')
			}
		}
		next()
	},
	checkNotLogin: (req, res, next) => {
		if (req.session.user) {
			req.flash('error', '已登录')
			return res.redirect('back')
		}
		next()
	}
}