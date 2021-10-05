const express = require('express')
const router = express.Router()
const auth = require('./authentication')

router.post('/login', (req, res) => {

    const { email, password } = req.body

    auth.authenticate(email, password)
        .then((userInfo) => {
            res.status(200).json({ authorization: userInfo.userToken })
        })
        .catch(error => {
            res.status(403).json({ msg: error })
        })
})


module.exports = router