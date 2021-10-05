const auth = require('../authentication/authentication')

const mwAuth = (req, res, next) => {

    console.log("Checking auth")

    const { authorization } = req.headers

    if(!authorization){
        res.status(401).json({msg: "Token not found"})
    }

    let sessionObj
    try{
        sessionObj = auth.verifyJwt(authorization)
    }catch(e){
        res.status(400).json({msg: "Invalid token"})
        return
    }

    console.log(sessionObj)

    if (sessionObj) {
        res.locals.userSession = sessionObj;
        next()
    } else {
        res.status(401).json({ msg: "Unauthorized" })
    }
}

module.exports = mwAuth