const mysql = require('mysql2');
const bcrypt = require('bcrypt')
const saltRounds = 2
const expiration = 5 * 60 * 1000
require('dotenv').config()

class Authentication {

    constructor() {
        this.sessions = []
    }

    authenticate(email, password) {
        let con = this._getConnection()

        return new Promise((resolve, reject) => {

            con.connect(err => {

                if (err) { console.log(err); reject(err); return }

                var values = [email]
                var sql = "select id, password, company from booking.user where email = ?"

                con.query(sql, values, (err, rows) => {

                    if (err !== null) {
                        reject(err)
                        return
                    }

                    if (!rows || rows.length === 0) {
                        reject("User not found")
                        return
                    }

                    const hash = Buffer.from(rows[0].password).toString()

                    this._compareBcrypt(password, hash)
                        .then(() => this._generateSessionToken())
                        .then(hash => {
                            this._addSession(hash, rows[0].id, email, rows[0].company)
                            resolve(hash)
                        })
                        .catch(err => reject(err))
                })
            })

        })

    }

    _genBCrypt(input) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(input, saltRounds, (err, hash) => {
                if (err) {
                    console.log("error generating hash: " + err)
                    reject(err)
                    return
                }
                resolve(hash)
            });
        })
    }

    _compareBcrypt(input, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(input, hash, (err, result) => {
                if (err) { reject(err); return }
                resolve(result)
            });
        })

    }

    _generateSessionToken() {
        return this._genBCrypt(Date.now().toString())
    }

    _addSession(sessionToken, id, email, company) {
        const session = { sessionToken, id, email, company, time: Date.now() }
        console.log("pushing new session for user " + email)
        console.log(session)
        this.sessions.push(session)
    }

    sessionIsValid(sessionToken) {

        let sessionObj = this.sessions.find((sObj) => {
            return sessionToken === sObj.sessionToken
        })

        const valid = sessionObj && (sessionObj.time + expiration > Date.now())

        if (!valid) {
            this.sessions = this.sessions.filter((token) => {
                return sessionToken !== token
            })
            return
        }
        return sessionObj
    }

    _getConnection() {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        })
    }

}

module.exports = new Authentication()