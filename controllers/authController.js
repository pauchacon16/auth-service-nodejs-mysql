// Importar los módulos necesarios.
import bcrypt from "bcrypt";
import pool from "../config/database.js";
import { generateToken } from "../lib/token.js";

// Función controladora para el registro de usuarios.
export const register = async (req, res) => {
    const { username, email, phone, password } = req.body;

    // Validar si se proporcionaron los datos requeridos
    if(!username){
        return res.status(400).json({error: 'Se requiere el nombre.'});
    }
    if(!email){
        return res.status(400).json({error: 'Se requiere el correo electrónico.'});
    }
    if(!phone){
        return res.status(400).json({error: 'Se requiere el teléfono.'});
    }
    if(!password){
        return res.status(400).json({error: 'Se requiere la contraseña.'});
    }

    try {
        // Verificar si el correo electronico ya existe.
        const [rows] = await pool.query("SELECT COUNT(*) FROM USUARIOS WHERE EMAIL = ?", [email.toLowerCase()]);
        if(rows.length === 1){
            if(rows[0]["COUNT(*)"] > 0){
                return res.status(400).json({ error: "El correo electrónico ya se encuentra registrado." });
            }
        }
        const hashPass = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO USUARIOS (NOMBRE, EMAIL, TELEFONO, PASSWORD) VALUES (?, ?, ?, ?)",
            [username, email, phone, hashPass]
        );
        return res.status(201).json({ message: 'Usuario registrado exitosamente'});
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
};

// Función controladora para el inicio de sesión de usuarios.
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validar si se proporcionaron nombre de usuario y contraseña.
    if (!email || !password) {
        return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña.' });
    }

    // Verificar si el usuario existe y si la contraseña es correcta.
    try {  
        const [rows] = await pool.query("SELECT * FROM USUARIOS WHERE EMAIL = ?", [email.toLowerCase()]);
        if(rows.length === 1){
            const user = rows[0];
            const passwordDB = user.password;
            const confirmPass = await bcrypt.compare(password, passwordDB)
            if(confirmPass){
                const token = generateToken({id: user.id, username: user.email});
                return res.status(200).json({ message: 'Autenticación satisfactoria', token: token});
            }else{
                return res.status(401).json({error: "Error en la autenticación: credenciales inválidas."});
            }
        }else{
            return res.status(404).json({error: "Usuario no se encuentra registrado"});
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
    }
};