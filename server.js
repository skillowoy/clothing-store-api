const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'online_clothing_store123'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Успішне підключення до БД online_clothing_store!');
});

// 1. READ: Отримати список усіх покупців
app.get('/buyers', (req, res) => {
  db.query('SELECT * FROM buyers', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 2. CREATE: Додати нового покупця
app.post('/buyers', (req, res) => {
  const { first_name, last_name, email, phone, address } = req.body;
  const query = 'INSERT INTO buyers (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [first_name, last_name, email, phone, address], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Покупця успішно додано!', buyer_id: results.insertId });
  });
});

// 3. UPDATE: Оновити дані покупця
app.put('/buyers/:id', (req, res) => {
  const { first_name, last_name, email, phone, address } = req.body;
  const { id } = req.params;
  const query = 'UPDATE buyers SET first_name=?, last_name=?, email=?, phone=?, address=? WHERE buyer_id=?';
  
  db.query(query, [first_name, last_name, email, phone, address, id], (err) => {
    if (err) throw err;
    res.json({ message: 'Дані покупця успішно оновлено!' });
  });
});

// 4. DELETE: Видалити покупця
app.delete('/buyers/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM buyers WHERE buyer_id=?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Покупця видалено з бази!' });
  });
});

// Отримати всі товари
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Отримати всі замовлення з інформацією про статуси
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер магазину запущено на порту ${PORT}`);
});