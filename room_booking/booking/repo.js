const mysql = require('mysql2');
require('dotenv').config()

class BookingRepository {

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'booking',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    bookings() {
        return new Promise((resolve, reject) => {

            var sql = "select * from booking b join booking.timeslot t on b.timeslot_id = t.id join booking.meeting_room mr on b.room_id = mr.id order by t.id, mr.name"

            this.pool.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })

        })
    }

    bookRoom(timeSlotId, roomId, userId, userCompany) {

        return new Promise((resolve, reject) => {

            this.pool.query("select 1 from meeting_room mr where mr.company = ? and mr.id = ?", [userCompany, roomId], (err, result) => {
                if (err) { reject(err); return }
                if (result.length === 0) { reject("You cannot book a room from a company different than yours!"); return }
            })

                //actually insert and book a room
                var sql = "insert into booking (room_id, timeslot_id, reserved_by) values (?, ?, ?)"

                this.pool.query(sql, [roomId, timeSlotId, userId], (err, result) => {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            reject("That room has already been booked")
                            return
                        }
                    }
                    resolve({ timeSlotId, roomId, userId, userCompany })
                })
        })
    }

    cancelBooking(timeSlotId, roomId, userId, userCompany) {
        return new Promise((resolve, reject) => {

            this.pool.query("select 1 from booking b where b.reserved_by = ? and b.room_id = ? and timeslot_id = ?", [userId, roomId, timeSlotId], (err, result) => {
                if (err) { reject(err); return }
                if (!result || result.length === 0) reject("Could not cancel booking"); return
            })

            //actually delete booking
            var sql = "delete from booking b where b.reserved_by = ? and b.room_id = ? and timeslot_id = ?"

            this.pool.query(sql, [userId, timeSlotId, roomId], (err, result) => {
                if (err) { reject(err); return }
                resolve({ timeSlotId, roomId, userId, userCompany })
            })
        })
    }
}

module.exports = BookingRepository