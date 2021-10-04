const express = require('express')
const app = express()
const path = require('path')
const mwAuth = require('./middleware/auth')
const PORT = process.env.PORT || 5000

app.listen(PORT,
    () => console.log(`Server running on http://localhost:${PORT}`))

app.use(express.json())
app.use(express.urlencoded({ extender: false }))

app.use('/api', mwAuth, require('./booking/controller'))
app.use('/auth', require('./auth/controller'))
