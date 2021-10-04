
const express = require('express')
const router = express.Router()

const auth = require('../auth/authentication')

router.post('/login', (req, res) => {

    const { email, password } = req.body

    auth.authenticate(email, password)
        .then((hash) => {
            res.status(200).json({ authorization: hash })
        })
        .catch(error => {
            res.status(403).json({ msg: error })
        })
})


module.exports = router