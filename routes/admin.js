const express = require('express');
const router = express.Router();

// Requiring Controllers
const AdminController = require('../controllers/adminController');


// Admin Routes //

// GET Login Home Page
router.get('/', AdminController.index);

// Handle post request to login page
router.post('/',AdminController.auth);

module.exports = router;