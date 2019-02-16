module.exports = function (app) {
    app.use('/admin', require('./admin'))
    app.use('/user', require('./user'))

    // Home
    app.get('/', function (req, res) {
        res.render('index')
    })

    // About
    app.get('/about', function (req, res) {
        res.render('about', { title: 'About This Site' })
    })

    // 404 Page
    app.get('*', function (req, res) {
        res.status(404).send('404 - Unknown Page')
    })
}
