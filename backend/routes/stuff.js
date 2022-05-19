const express = require('express');

const router = express.Router();

const stuffController = require('../controllers/stuff');
const auth = require('../middleware/auth');



module.exports = router;