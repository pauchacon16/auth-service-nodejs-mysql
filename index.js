// Importar los módulos necesarios.
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/database');

// Crear una instancia de la aplicación Express.
const app = express();
const PORT = 3000; // Definir el puerto en el que el servidor escuchará.

//Conectar a la base de datos mongo
connectDB();
// Middleware para parsear el cuerpo de las peticiones como JSON.
app.use(bodyParser.json());

// Usar las rutas de autenticación.
app.use('/api/auth', authRoutes);

// Iniciar el servidor y hacer que escuche en el puerto definido.
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});