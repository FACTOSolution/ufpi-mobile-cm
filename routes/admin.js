const express = require('express');
const router = express.Router();

// Requiring Controllers
const AdminController = require('../controllers/adminController');

// Middleware function to check if user is logged in
function isLocalAuthenticated(req, res, next) {
    if(req.user) { return next(); }
    res.redirect('/admin');
}

// Admin Routes //

// GET Login Home Page
router.get('/', AdminController.index);

// POST request to login page
router.post('/',AdminController.auth);

// GET Calendar Register Page
router.get('/calendar',isLocalAuthenticated,AdminController.callendar_get);


module.exports = router;