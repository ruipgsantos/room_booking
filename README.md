# room_booking

Accounts:

email: user1@coca.com
password: password1

email: user2@pepsi.com
password: password2


Endpoints:

POST - /auth/login
{
email,
password
}

Get all bookings
GET - /api/bookings

Book a room
PUT - /book/:timeslot/:roomid

Cancel a booking
DELETE - /book/:timeslot/:roomid


