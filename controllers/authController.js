// Importar los módulos necesarios.
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Función controladora para el registro de usuarios.
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Validar si se proporcionaron nombre de usuario y contraseña.
    if (!username || !password) {
        return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña.' });
    }

    try {
        // Verificar si el nombre de usuario ya existe.
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Nombre de usuario ya existe." });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        return res.status(201).json({ message: 'Usuario registrado exitosamente', username: newUser.username });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
};

// Función controladora para el inicio de sesión de usuarios.
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Validar si se proporcionaron nombre de usuario y contraseña.
    if (!username || !password) {
        return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña.' });
    }

    // Verificar si el usuario existe y si la contraseña es correcta.
    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({error: "Error en la autenticación: usuario no encontrado"});
        }

        const isPasswordValid = await user.comparePassword(password);
        if (isPasswordValid) {
            // Autenticación exitosa. En una aplicación real, aquí se generaría un token JWT.
            return res.status(200).json({ message: 'Autenticación satisfactoria', token: 'simulated_token' });
        } else {
            return res.status(401).json({ error: 'Error en la autenticación: credenciales inválidas.' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
    }
};