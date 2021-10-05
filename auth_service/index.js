const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mwAuth = require('./middleware/auth')
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config()

const PORT = process.env.PORT || 6000

app.use(morgan())
app.use(cors())
app.use(express.json())

const configTarget = "http://" + process.env.API_HOST + ":" + process.env.API_PORT

app.use('/api', mwAuth, createProxyMiddleware({
    target: process.env.API_HOST && process.env.API_PORT ? configTarget : "http://localhost:5001",
    changeOrigin: true,
}))

app.use('/auth', require('./authentication/controller'))

app.listen(PORT,
    () => console.log(`Server running on http://localhost:${PORT}`))