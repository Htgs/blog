const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const AdminUserModel = require('../models/adminuser')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin


module.exports = router