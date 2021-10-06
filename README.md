# room_booking

build with "docker-compose up"

Accounts:

email: user1@coca.com
password: password1

email: user2@pepsi.com
password: password2


Endpoints for localhost:6000

POST - /auth/login
{
email,
password
}

Get all bookings
GET - /api/bookings

Book a room
PUT - api/book/:timeslot/:roomid

Cancel a booking
DELETE - api/book/:timeslot/:roomid


