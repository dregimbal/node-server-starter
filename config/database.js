
module.exports = function () {
    let module = {}
    const { Client } = require('pg')
    const crypto = require('crypto')

    const connection = {
        connectionString: 'postgres://user:pass@host:5432/database',
        ssl: true
    }

    module.findUserByEmail = function (email) {
        return new Promise(
            function (resolve, reject) {
                const text = 'SELECT "userId", "userName", "userEmail", "userPassword"bFROM "tblUsers" WHERE "userEmail"=$1'
                let client = new Client(connection)
                client.connect()
                client.query(text, [email])
                    .then(res => {
                        resolve(res.rows[0])
                    })
                    .catch(e => {
                        reject(e)
                    })
                    .then(() => {
                        client.end()
                    })
            }
        )
    }

    module.findUserById = function (id) {
        return new Promise(
            function (resolve, reject) {
                const text = 'SELECT "userId", "userName", "userEmail", "userPassword" FROM "tblUsers" WHERE "userId"=$1'
                let client = new Client(connection)
                client.connect()
                client.query(text, [id])
                    .then(res => {
                        resolve(res.rows[0])
                    })
                    .catch(e => {
                        reject(e)
                    })
                    .then(() => {
                        client.end()
                    })
            }
        )
    }

    module.hashPassword = function (password) {
        return new Promise(
            function (resolve, reject) {
                resolve(crypto.createHash('md5').update(password).digest('hex'))
            }
        )
    }

    module.insertUser = function (user) {
        return new Promise(
            function (resolve, reject) {
                const text = `INSERT INTO "tblUsers" ("userName", "userEmail", "userPassword")
                    VALUES($1, $2, $3) 
                    RETURNING *`
                const values = [user.name, user.email, user.hashedPassword]
                let client = new Client(connection)
                client.connect()
                client.query(text, values)
                    .then(res => {
                        console.log(res.rows[0])
                    })
                    .catch(e => {
                        reject(e)
                    })
                    .then(() => {
                        client.end()
                        resolve()
                    })
            }
        )
    }

    return module
}
