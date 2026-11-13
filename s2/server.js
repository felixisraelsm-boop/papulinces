const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a XAMPP (MySQL)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ahorrometro'
});

db.connect((err) => {
  if (err) throw err;
  console.log('¡Conectado a la base de datos de XAMPP!');
});

// Ruta de prueba
app.get('/api/datos', (req, res) => {
  db.query('SELECT * FROM tu_tabla', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Ruta para guardar únicamente el total de la lista y la fecha actual
app.post('/api/guardar-lista', (req, res) => {
  const { totalGeneral } = req.body;

  if (totalGeneral === undefined || totalGeneral <= 0) {
    return res.status(400).json({ error: 'El total no es válido o la lista está vacía' });
  }

  const query = 'INSERT INTO historial_listas (total_general) VALUES (?)';

  db.query(query, [totalGeneral], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
    
    res.json({ mensaje: '¡Total guardado con éxito!', id: result.insertId });
  });
});

// Ruta para consultar el historial de totales en el futuro
app.get('/api/historial', (req, res) => {
  const query = 'SELECT * FROM historial_listas ORDER BY fecha DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// app.listen va SIEMPRE al final de todo
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});