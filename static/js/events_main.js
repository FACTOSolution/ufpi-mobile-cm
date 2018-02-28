// Connecting the submit listener with the event handler
document.getElementById('eventForm').addEventListener('submit', eventRegister);

function eventRegister (e) {
    // Variables that will hold the values of the form
    var title, location, date, time, dateTime;
    // Getting the values
    title = document.getElementById('nEvento').value;
    location = document.getElementById('lEvento').value;
    date = document.getElementById('dEvento').value;
    time = document.getElementById('hEvento').value;
    dateTime = date + ' ' + time

    console.log(dateTime);

    axios.post('http://localhost:8080/api/notifications', {
        title: title,
        location: location,
        startDate: dateTime
    })
    .then(function(response){
        alert("Evento Cadastrado")
    })
    .catch(function(err){   
        console.log(err.message);
    })

    e.preventDefault();
}