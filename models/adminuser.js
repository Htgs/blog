const AdminUser = require('../lib/mongoose').AdminUser

module.exports = {
	created: function (adminuser) {
		return AdminUser.create(adminuser)
	},
	getAdminByName: function (name) {
		return AdminUser.findOne({ name: name })
	},
	updateSignIn: function (userId) {
		return AdminUser.findOneAndUpdate({ _id: userId }, { $set: { changed_at: Date.now() } })
	},
	passwordById: function (userId, password) {
		return AdminUser.findOneAndUpdate({ _id: userId }, { $set: { password: password } })
	}
}
