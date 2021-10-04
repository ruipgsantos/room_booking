const mysql = require('mysql2');
require('dotenv').config()

class BookingRepository {

    rooms() {
        return new Promise((resolve, reject) => {

            const con = this._getConnection()

            con.connect(err => {
                if (err) reject(err)

                var sql = "select * from booking.booking b join booking.timeslot t on b.timeslot_id = t.id join booking.meeting_room mr on b.room_id = mr.id order by t.id, mr.name"

                con.query(sql, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                })
            })

        })
    }

    bookRoom(timeSlotId, roomId, userId, userCompany) {

        return new Promise((resolve, reject) => {
            const con = this._getConnection()

            con.connect(err => {
                if (err) { reject(err); return }

                con.query("select 1 from booking.meeting_room mr join booking.user u on mr.company = u.company where mr.company = ? and mr.id = ?", [userCompany, roomId], (err, result) => {
                    if (err) { reject(err); return }
                    if (result.length === 0) { reject("You cannot book a room from a company different than yours!"); return }
                })

                try {
                    //actually insert and book a room
                    var sql = "insert into booking.booking (room_id, timeslot_id, reserved_by) values (?, ?, ?)"

                    con.query(sql, [roomId, timeSlotId, userId], (err, result) => {
                        if (err) { reject(err); return }
                        resolve({ timeSlotId, roomId, userId, userCompany })
                    })
                } catch (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        reject("That room has already been booked")
                        return
                    }
                }

            })
        })
    }

    cancelBooking(timeSlotId, roomId, userId, userCompany) {
        return new Promise((resolve, reject) => {
            const con = this._getConnection()

            con.connect(err => {
                if (err) { reject(err); return }

                con.query("select 1 from booking.booking b where b.reserved_by = ? and b.room_id = ? and timeslot_id = ?", [userId, roomId, timeSlotId], (err, result) => {
                    if (err) { reject(err); return }
                    if (!result || result.length === 0) reject("Could not cancel booking"); return
                })

                //actually delete booking
                var sql = "delete from booking.booking b where b.reserved_by = ? and b.room_id = ? and timeslot_id = ?"

                con.query(sql, [userId, timeSlotId, roomId], (err, result) => {
                    if (err) { reject(err); return }
                    resolve({ timeSlotId, roomId, userId, userCompany })
                })
            })
        })
    }

    _getConnection() {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        })
    }
}

module.exports = BookingRepository