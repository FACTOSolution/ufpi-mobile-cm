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
router.get('/calendars',isLocalAuthenticated,AdminController.callendar_register_get);

// GET Calendar Event Register Page
router.get('/calendars/:id/events', isLocalAuthenticated,AdminController.callendar_event_register_get);

// GET Event Register Page
router.get('/events', isLocalAuthenticated, AdminController.event_register_get);

// GET Menu Register Page
router.get('/menus', isLocalAuthenticated, AdminController.menu_register_get);

module.exports = router;