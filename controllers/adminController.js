const passport = require('passport')

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.index = function(req, res) {
    res.render('site-ufpi');
}

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
                        return res.render('calendario');
                    case "RU":
                        return res.render('restaurante');
                    case "EVEN":
                        return res.render('evento');
                    default:
                        return res.render('site-ufpi');
                }
            });
        })(req, res, next);
    }
]