let LocalStrategy = require('passport-local').Strategy

module.exports = function (passport, db) {
    passport.use('user', new LocalStrategy({
        passReqToCallback: true,
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
