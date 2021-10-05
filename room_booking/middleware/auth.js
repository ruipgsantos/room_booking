require('dotenv').config()
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || 'e5c8a121-0aea-44c8-9e58-f8bec601a0d1'

const mwAuth = (req, res, next) => {

    console.log("Checking auth")

    const { authorization } = req.headers
    const sessionObj = jwt.verify(authorization, secretKey)

    if (sessionObj) {
        console.log("saving session:")
        console.log(sessionObj)
        res.locals.userSession = sessionObj;
        next()
    } else {
        res.status(401).send({ msg: "Unauthorized" })
    }
}

module.exports = mwAuth