module.exports = function (passport) {
    let LocalStrategy = require('passport-local').Strategy
    let db = require('./database')

    passport.use('user', new LocalStrategy({
        passReqToCallback: false,
        passwordField: 'password',
        usernameField: 'email'
    },
        (email, password, done) => {
            db.findUserByEmail(email)
                .then(user => {
                    db.hashPassword(password)
                        .then(pass => {
                            if (pass !== user.userPassword) {
                                return done(null, false, { message: 'Invalid credentials.\n' });
                            }
                            return done(null, user)
                        })
                })
                .catch(error => done(error))
        }
    ))

    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.userId)
    })

    // deserialize the user
    passport.deserializeUser(function (id, done) {
        db.findUserById(id)
            .then(user => {
                done(null, user)
            })
    })
}
