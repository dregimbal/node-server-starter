
let passport = require('passport')
let router = require('express').Router()
let db = require('../config/database')

router.use(function (req, res, next) {
    let _render = res.render
    res.render = function (view, options, fn) {
        options = {
            title: 'Admin',
            ...options
        }
        _render.call(this, view, options, fn)
    }
    next()
})

function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/admin/signIn')
    }
    return next()
}


router.get('/', function (req, res) {
    res.redirect('/admin/adminPanel')
})

router.get('/adminPanel', isAuthenticated, function (req, res) {
    res.render(
        'admin/adminPanel',
        {
            title: 'Admin Panel',
            user: req.user
        })
})

router.get('/commenterInfo', isAuthenticated, function (req, res) {
    db.getCommenterInfo(req.params.location, req.params.job)
        .then(employees => {
            res.render('admin/commenterInfo', { commenters: commenters })
        })
        .catch(e => {
            res.render('admin/commenterInfo', { commenters: [], error: e })
        })
})

router.get('/videoStats', isAuthenticated, function (req, res) {
    db.getVideoStats()
        .then(videos => {
            res.render('admin/videoStats', { videos: videos })
        })
        .catch(e => {
            res.render('admin/videoStats', { error: e, videos: [] })
        })
})

router.get('/tokenHolders', isAuthenticated, function (req, res) {
    db.getTokenHolders()
        .then(tokenHolders => {
            res.render('admin/tokenHolders', { tokenHolders: tokenHolders })
        })
        .catch(e => {
            res.render('admin/tokenHolders', { error: e, tokenHolders: [] })
        })
})


router.get('/signIn', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/admin/adminPanel')
    } else {
        res.render('user/signIn', {
            postURL: '/admin/signIn'
        })
    }
})

router.post('/signIn',
    passport.authenticate('user',
        {
            failureRedirect: '/admin/signIn',
            successRedirect: '/admin/adminPanel'
        }
    )
)

router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

module.exports = router
