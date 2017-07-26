const express = require('express');
const router = express.Router();

const entryController = require('../controllers/entryController');

const { findErrors } = require('../handlers/errorHandlers');

router.get('/', entryController.home);
router.get('/dashboard', entryController.dashboard);

router.get('/entries', entryController.addEntry);
router.post('/entries', findErrors(entryController.createEntry));

module.exports = router;
