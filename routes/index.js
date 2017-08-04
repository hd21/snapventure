const express = require('express');
const router = express.Router();

const entryController = require('../controllers/entryController');

const { findErrors } = require('../handlers/errorHandlers');

router.get('/', entryController.home);
router.get('/entries', entryController.dashboard);
router.get('/entries/page/:page', findErrors(entryController.dashboard));

router.get('/new', entryController.createEntry_get);
router.post('/entries/edit', findErrors(entryController.createEntry_post));

router.get('/entry/:id', findErrors(entryController.getEntryById));
router.get('/entries/:id', findErrors(entryController.updateEntry_get));
router.post('/entries/edit/:id', findErrors(entryController.updateEntry_post));
router.post('/entries/delete/:id', findErrors(entryController.deleteEntry));

module.exports = router;
