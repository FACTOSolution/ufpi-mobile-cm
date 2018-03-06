// Connecting the submit event with the event handlers
document.getElementById('calendarEventForm').addEventListener('submit',registerCalendarEvent);

function registerCalendarEvent(e){
    // Variables that will hold the values of the form
    var title, startDate, endDate;
    // Getting the values
    title = document.getElementById('e-titulo').value;
    startDate = document.getElementById('e-datain').value;
    endDate = document.getElementById('e-datafim').value;
    calendar_id = document.getElementById('calendar_id').value;

    axios.post("http://mobile.ufpi.br/api/calendars/" + calendar_id + "/events", {
        title: title,
        startDate: startDate,
        endDate: endDate
    })
    .then(function(response) {
        alert("Evento Cadastrado")
    })
    .catch(function(err){
        alert("Falha no cadastro do Evento")
        console.log(err.message)
    })

    e.preventDefault();
}