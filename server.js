let express = require('express')
let app = express()
let passport = require('passport')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let FileStore = require('session-file-store')(session)

// Database connection
let db = require('./config/database')

// Set view engine to EJS
app.set('view engine', 'ejs')

// Set /public/ for 'frontend' files
app.use(express.static('public'))

// Configure body parser (gives req.body from form submits)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configure cookies to be able to be read
app.use(cookieParser())

// Configure Session Middleware
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'Secret Key For Session Data',
    store: new FileStore({
        ttl: 86400
    })
}))

// Configure Passport for user auth
require('./config/passport')(passport, db)
app.use(passport.initialize())
app.use(passport.session())


// add footer and header partials
const partialsDir = __dirname + '/views/partials/'
app.use(function (req, res, next) {
    let _render = res.render
    res.render = function (view, options, fn) {
        options = {
            title: 'Site Name',
            ...options,
            footer: partialsDir + 'footer',
            header: partialsDir + 'header',
            loggedIn: req.isAuthenticated()
        }
        _render.call(this, view, options, fn)
    }
    return next()
})

// Routing
require('./routes/index.js')(app)

// Start listening for requests
const listener = app.listen(8080, function () {
    console.log('Server listening on port ' + listener.address().port)
})
