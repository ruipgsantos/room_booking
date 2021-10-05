require('dotenv').config()
const mysql = require('mysql2');
const bcrypt = require('bcrypt')
const saltRounds = 2
const secretKey = process.env.JWT_SECRET_KEY || 'e5c8a121-0aea-44c8-9e58-f8bec601a0d1'
var jwt = require('jsonwebtoken');

class Authentication {

    authenticate(email, password) {
        let con = this._getConnection()

        return new Promise((resolve, reject) => {

            con.connect(err => {

                if (err) { console.log(err); reject(err); return }

                var values = [email]
                var sql = "select id, password, company from auth.user where email = ?"

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
                        .then(() => this._signJwt({
                            userId: rows[0].id,
                            userEmail: email,
                            userCompany: rows[0].company
                        }))
                        .then(token => {
                            resolve({
                                userToken: token,
                                userId: rows[0].id,
                                userEmail: email,
                                userCompany: rows[0].company
                            })
                        })
                        .catch(err => reject(err))
                })
            })

        })

    }

    _signJwt(userInfo) {
        return jwt.sign({
            data: userInfo
        }, secretKey, { expiresIn: '1h' });
    }

    verifyJwt(token) {
        return jwt.verify(token, secretKey)
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