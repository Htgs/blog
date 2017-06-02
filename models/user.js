const User = require('../lib/mongo').User

module.exports = {
    create: function (user) {
        return User.create(user).exec()
    },
    getUserByName: function (name) {
    	// return User.findOne({ name: name }).exec()
    	return User.findOne({ name: name }).addCreatedAt().exec()
    },
    passwordById: function (userId, password) {
    	return User.update({ _id: userId }, { password: password }).exec()
    }
}
