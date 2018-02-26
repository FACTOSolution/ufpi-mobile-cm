// Connect the submit event with the event handler method
document.getElementById('calendar-form').addEventListener('submit',registerCalendar);

// Function that will call the API and register a calendar
function registerCalendar(e) {
    // Variable that will hold the values of the form
    var title, year, kind, campus;
    // Getting the value
    title = document.getElementById('nCalendario').value;
    year = document.getElementById('s-ano').value;
    kind = document.getElementById('s-tipo').value;
    campus = document.getElementById('s-campus').value;

    axios.post("http://localhost:8080/api/calendars", {
        title: title,
        year: year,
        kind: kind,
        campus: campus
    })
    .then(function(response){
        console.log(response);
    })
    .catch(function(error){
        console.log(error);
    });

    e.preventDefault();
}