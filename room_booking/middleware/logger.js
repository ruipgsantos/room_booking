//middleware
const logger = (req, res, next) => {
    console.log("middleware is working!")
    next()
}

module.exports = logger