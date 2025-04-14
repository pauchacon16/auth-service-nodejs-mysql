const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definir la ruta para el registro de usuarios (POST a /api/auth/register).
router.post('/register', authController.register);

// Definir la ruta para el inicio de sesión de usuarios (POST a /api/auth/login).
router.post('/login', authController.login);

module.exports = router;