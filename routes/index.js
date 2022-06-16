var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');

router.get('/movies', function (req, res, next) {
    try {
        req.pool.getConnection(function (err, connection) {
            if (err) {
                res.sendStatus(500);
                console.error(err);
                return;
            }
            var query = `SELECT * FROM Movies;`;
            connection.query(query, function (err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    console.error(err);
                    return;
                }
                res.json(rows); //send response
            });
        });
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/dates/:movie_id', function (req, res, next) {
    try {
        req.pool.getConnection(function (err, connection) {
            if (err) {
                res.sendStatus(500);
                console.error(err);
                return;
            }
            var query = `SELECT * FROM Screenings Where movie_id = ?;`;
            connection.query(query, [req.params.movie_id], function (err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    console.error(err);
                    return;
                }
                res.json(rows); //send response
            });
        });
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/seats/:screenig_id', function (req, res, next) {
    try {
        req.pool.getConnection(function (err, connection) {
            if (err) {
                res.sendStatus(500);
                console.error(err);
                return;
            }
            var query = `SELECT Seats.* FROM Seats Where Seats.id NOT IN (SELECT SR.seat_id FROM Reservation INNER JOIN Screenings ON Reservation.screening_id = Screenings.id INNER JOIN Seats_Reserved SR on Reservation.id = SR.reservation_id WHERE Screenings.id = ?);`;
            connection.query(query, [req.params.screenig_id], function (err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    console.error(err);
                    return;
                }
                res.json(rows); //send response
            });
        });
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router;
