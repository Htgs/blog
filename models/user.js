const User = require('../lib/mongoose').User

module.exports = {
    create: function (user) {
        return User.create(user)
    },
    getUserByName: function (name) {
    	return User.findOneAndUpdate({ name: name }, { $set: { changed_at: Date.now() } })
    },
    passwordById: function (userId, password) {
    	return User.findOneAndUpdate({ _id: userId }, { password: password })
    }
}
