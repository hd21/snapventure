const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { findErrors } = require('../handlers/errorHandlers');

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegistration, userController.register, authController.login);
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
