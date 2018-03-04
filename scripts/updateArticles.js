const axios = require('axios');
const Agenda = require('agenda')

// Defining a new Agenda
const agenda = new Agenda({db: { address: process.env.MONGODB_URI }});

agenda.define('update articles', function(job, done) {
    axios.get(process.env.HOSTURL + '/api/articles');
});

agenda.on('ready', function(){
    agenda.every('2 minutes', 'update articles');
})