const express = require('express');
const router = express.Router();
const { getAllUnits } = require('../controllers/unitController');

router.get('/', getAllUnits);

module.exports = router;