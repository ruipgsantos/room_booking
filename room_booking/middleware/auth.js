const auth = require('../auth/authentication')

const mwAuth = (req, res, next) => {

    console.log("Checking auth")

    const { authorization } = req.headers

    const sessionObj = auth.sessionIsValid(authorization)

    if (sessionObj) {
        res.locals.userSession = sessionObj;
        next()
    } else {
        res.status(401).json({ msg: "Unauthorized" })
    }
}

module.exports = mwAuth