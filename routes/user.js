let passport = require('passport')
let router = require('express').Router()
let db = require('../config/database')

router.use(function (req, res, next) {
    let _render = res.render
    res.render = function (view, options, fn) {
        options = {
            title: 'User',
            ...options
        }
        _render.call(this, view, options, fn)
    }
    next()
})

function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/user/signIn')
    }
    return next()
}


router.get('/', function (req, res) {
    res.redirect('/user/profile')
})

router.get('/signIn', function (req, res) {
    res.render('user/signIn', {
        postURL: '/user/signIn'
    })
})

router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

router.get('/signUp', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/user/profile')
    } else {
        res.render('user/signUp', {
            postURL: '/user/signUp'
        })
    }
})

router.post('/signIn',
    passport.authenticate('user',
        {
            failureRedirect: '/user/signIn',
            successRedirect: '/user/profile'
        }
    )
)

router.post('/signUp', (req, res) => {
    db.insertUser(req.body)
        .then(() => {
            res.redirect('/user/signIn')
        })
        .catch((e) => {
            console.log(e)
        })
})


router.get('/profile', isAuthenticated, function (req, res) {
    res.render('user/profile',
        {
            title: 'Profile ' + req.user.userId,
            user: {
                email: req.user.userEmail,
                id: req.user.userId,
                name: req.user.userName
            }
        })
})

module.exports = router
