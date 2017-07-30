const express = require('express');
const router = express.Router();

const entryController = require('../controllers/entryController');

const { findErrors } = require('../handlers/errorHandlers');

router.get('/', entryController.home);
router.get('/dashboard', entryController.dashboard);
router.get('/dashboard/page/:page', findErrors(entryController.dashboard));

router.get('/new', entryController.addEntry);
router.post('/new', findErrors(entryController.createEntry));
router.put('/new/:id', findErrors(entryController.updateEntry));

module.exports = router;
