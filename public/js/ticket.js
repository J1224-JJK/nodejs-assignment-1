window.onload = () => {
    (async function () {
        await fetchMovies()
    })()
}


async function fetchMovies () {
    const movieSelect = document.getElementById("movie-select")
    let resp = await fetch('/movies')
    let movies = await resp.json()
    let txt = `<select name="movie" id="movie" onchange="fetchDates(event)"><option>Select a Movie</option>`
    movies.forEach(element => {
        txt += `<option value="${element.id}">${element.title}</option>`
    });
    txt += `</select>`
    movieSelect.innerHTML = txt
}

async function fetchDates (e) {
    const dateSelect = document.getElementById("date-select")
    let resp = await fetch(`/dates/${e.target.value}`)
    let dates = await resp.json()
    let txt = `<select name="date" id="date" onchange="fetchSeats(event)"><option>Select a date</option>`
    dates.forEach(element => {
        txt += `<option value="${element.id}">${element.screening_date.split("T")[0]}</option>`
    });
    txt += `</select>`
    dateSelect.innerHTML = txt
}

async function fetchSeats (e) {
    const ticketSelect = document.getElementById("ticket-select")
    let resp = await fetch(`/seats/${e.target.value}`)
    let tickets = await resp.json()
    let txt = `<select name="ticket" id="ticket" multiple>`
    tickets.forEach(element => {
        txt += `<option value="${element.id}">Row Name: ${element.seat_row} & Seat No: ${element.seat_no}</option>`
    });
    txt += `</select>`
    ticketSelect.innerHTML = txt
}
