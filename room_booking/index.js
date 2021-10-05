const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT || 5001
require('dotenv').config()

const mwAuth = require('./middleware/auth')

const AUTH_ORIGIN = process.env.AUTH_ORIGIN || 'http://localhost:6000'

app.use(morgan())
app.use(cors({
    origin: AUTH_ORIGIN
}))

app.use('/api', mwAuth, require('./booking/controller'))

app.use(express.json())

app.listen(PORT,
    () => console.log(`Server running on http://localhost:${PORT}`))
