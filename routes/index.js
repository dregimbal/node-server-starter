var express = require('express')
var router = express.Router()

router.use('/admin', require('./admin'))
router.use('/user', require('./user'))

// Home
router.get('/', function (req, res) {
    res.render('index')
})

// About
router.get('/about', function (req, res) {
    res.render('about', { title: 'About This Site' })
})

// 404 Page
router.get('*', function (req, res) {
    res.status(404).send('404 - Unknown Page')
})

module.exports = router
