const passport = require('passport')
const async = require('async')

const Calendar = require('../models/calendar');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display login page for admin area
exports.index = function(req, res, next) {
    res.render('site-ufpi');
}

// Handle post request of login
exports.auth = [

    // Validating fields
    body('email', 'Email não pode ser vázio').isLength({ min: 1 }).trim(),
    body('password', 'Senha não pode ser vázia').isLength({ min: 1 }).trim(),

    // Sanitize fields using wildcard
    sanitizeBody('*').trim().escape(),

    // Process the request after validation and sanitization
    (req, res, next) => {

        // Extract the validation errors from a request
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            // If there are errors. Render form again with sanitized values/errors messages
           return  res.render('site-ufpi', { errors: errors.array() });
        }

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.render('site-ufpi', { flashMessage: "Usuário não encontrado" }); }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                switch(user.kind){
                    case "CAL":
                        return res.redirect('/admin/calendars');
                    case "RU":
                        return res.render('restaurante');
                    case "EVEN":
                        return res.render('evento');
                    default:
                        return res.redirect('/admin');
                }
            });
        })(req, res, next);
    }
]

exports.callendar_get = function(req, res, next) {
    if (req.user.kind != 'CAL') { 
        const error = new Error();
        error.status = 403; 
        throw error;
    }
    return res.render('calendario', { kinds: Calendar.schema.path("kind").enumValues })
}   

exports.callendar_event_get = function(req, res, next) {
    return res.render('calendario-eventos', { calendarId: req.params.id });
}