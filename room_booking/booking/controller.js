const BookingRepository = require('./repo')
const express = require('express')
const router = express.Router()

const bookRepo = new BookingRepository()

router.get('/bookings', (req, res) => {

    bookRepo.rooms().then((result) => {
        res.status(200).json(result)
    })
        .catch(error => {
            console.log(error)
            res.status(500).send()
        })
})

router.put('/book/:timeslot/:id', (req, res) => {

    const userSession = res.locals.userSession

    bookRepo.bookRoom(req.params.timeslot, req.params.id, userSession.id, userSession.company)
        .then((result) => {
            res.status(200).json({ msg: "Room has been booked", booking: result })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({ msg: error })
        })
})

router.delete('/book/:timeslot/:id', (req, res) => {

    const userSession = res.locals.userSession

    bookRepo.cancelBooking(req.params.timeslot, req.params.id, userSession.id, userSession.company)
        .then((result) => {
            res.status(200).json({ msg: "Booking has been cancelled", booking: result })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({ msg: error })
        })
})

module.exports = router