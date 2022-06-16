var express = require('express');
var path = require('path');
var mysql = require('mysql2');
// var mysql = require('mysql');

var indexRouter = require('./routes/index');

var app = express();

var dbConnectionPool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Ronnie@1993',
    // database: 'test',
    multipleStatements: true
});

app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

function initialise_db() {
    dbConnectionPool.getConnection(function (err, connection) {
        if (err) {
            console.error(err.message)
            console.error("Unable to configure database. Is your database running and has the correct permissions?");
            return;
        }
        var setup = `
        DROP DATABASE IF EXISTS ticket_reservation;
        CREATE DATABASE ticket_reservation;
        USE ticket_reservation;
        
        CREATE TABLE Movies (
        id int NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        duration decimal(10,2) NOT NULL
        );

        INSERT INTO Movies (id, title, description, duration) VALUES
        (1, 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', '2.50');

        CREATE TABLE Reservation (
        id int NOT NULL,
        user_id int NOT NULL,
        screening_id int NOT NULL
        );

        INSERT INTO Reservation (id, user_id, screening_id) VALUES
        (1, 1, 2),
        (2, 1, 1);

        CREATE TABLE Screenings (
        id int NOT NULL,
        movie_id int NOT NULL,
        screening_date date NOT NULL
        );

        INSERT INTO Screenings (id, movie_id, screening_date) VALUES
        (2, 1, '2022-06-20'),
        (1, 1, '2022-06-25');

        CREATE TABLE Seats (
        id int NOT NULL,
        seat_no int NOT NULL,
        seat_row char(5) NOT NULL
        );

        INSERT INTO Seats (id, seat_no, seat_row) VALUES
        (1, 1, 'A'),
        (2, 2, 'A'),
        (3, 3, 'A'),
        (4, 4, 'A'),
        (5, 5, 'A'),
        (7, 2, 'C'),
        (6, 1, 'D'),
        (8, 2, 'D'),
        (9, 3, 'D'),
        (10, 4, 'D'),
        (11, 5, 'D'),
        (12, 1, 'J'),
        (13, 2, 'J'),
        (14, 3, 'J'),
        (15, 4, 'J'),
        (16, 5, 'J');

        CREATE TABLE Seats_Reserved (
        reservation_id int NOT NULL,
        seat_id int NOT NULL
        );

        INSERT INTO Seats_Reserved (reservation_id, seat_id) VALUES
        (1, 1),
        (1, 2),
        (2, 11),
        (2, 14);

        CREATE TABLE Users (
        id int NOT NULL,
        username varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        phone char(15) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL
        );

        INSERT INTO Users (id, username, name, phone, email, password) VALUES
        (1, 'john', 'John Doe', '1234567890', 'john@email.com', '$argon2i$v=19$m=16,t=2,p=1$cUprcmRXbDRWNmN6TkNWcQ$zlP8PdnyumlH9h074C6D6w');

        ALTER TABLE Movies
        ADD PRIMARY KEY (id);

        ALTER TABLE Reservation
        ADD PRIMARY KEY (id),
        ADD KEY user_id (user_id),
        ADD KEY screening_id (screening_id);

        ALTER TABLE Screenings
        ADD PRIMARY KEY (id),
        ADD UNIQUE KEY movie_id (movie_id,screening_date);

        ALTER TABLE Seats
        ADD PRIMARY KEY (id),
        ADD UNIQUE KEY seat_row (seat_row,seat_no);

        ALTER TABLE Seats_Reserved
        ADD PRIMARY KEY (reservation_id,seat_id),
        ADD KEY seat_id (seat_id);

        ALTER TABLE Users
        ADD PRIMARY KEY (id),
        ADD UNIQUE KEY email (email);

        ALTER TABLE Movies
        MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

        ALTER TABLE Reservation
        MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

        ALTER TABLE Screenings
        MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

        ALTER TABLE Seats
        MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

        ALTER TABLE Users
        MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

        ALTER TABLE Reservation
        ADD CONSTRAINT Reservation_ibfk_1 FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        ADD CONSTRAINT Reservation_ibfk_2 FOREIGN KEY (screening_id) REFERENCES Screenings (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

        ALTER TABLE Screenings
        ADD CONSTRAINT Screenings_ibfk_1 FOREIGN KEY (movie_id) REFERENCES Movies (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

        ALTER TABLE Seats_Reserved
        ADD CONSTRAINT Seats_Reserved_ibfk_1 FOREIGN KEY (seat_id) REFERENCES Seats (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
        ADD CONSTRAINT Seats_Reserved_ibfk_2 FOREIGN KEY (reservation_id) REFERENCES Reservation (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        COMMIT;
`;
        connection.query(setup, function (err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.error(err.message)
                // console.error("Unable to configure database. Is your database running and has the correct permissions?");
                return;
            }
            dbConnectionPool.on('connection', function (connection) {
                connection.query('USE wdc22_final_p2;');
            });
        });
    });
}

initialise_db();

module.exports = app;
