const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));
// Create a connection to the MySQL database
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',  
//     password: '', 
//     database: 'customer',
//     port: 3306,  
// });

const db = mysql.createConnection({
    host: 'mysql-1e3e5ecc-khonggo-1c2b.b.aivencloud.com',
    user: 'avnadmin',  
    password: 'AVNS_3y1ddLS-w9AdmQtS7m5', 
    database: 'customer',
    port: 21079,  
});
// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});

// CREATE: Add a new customer
app.post('/api/customers', (req, res) => {
    const { fullName, email, phoneNumber, dateOfBirth, address } = req.body;
    if (!fullName || !email || !phoneNumber || !dateOfBirth || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO Customers (FullName, Email, PhoneNumber, DateOfBirth, Address) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [fullName, email, phoneNumber, dateOfBirth, address], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);  // Log error
            return res.status(500).json({ error: 'Server error during customer creation' });
        }
        res.status(201).json({ message: 'Customer created successfully', customerId: result.insertId });
    });
});

// READ: Get all customers
app.get('/api/customers', (req, res) => {
    const query = 'SELECT * FROM Customers';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching customers:', err.message);
            return res.status(500).send('Server Error');
        }
        res.status(200).json(results);
    });
});

// READ: Get customer by ID
app.get('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Customers WHERE CustomerID = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching customer:', err.message);
            return res.status(500).send('Server Error');
        }
        if (result.length === 0) {
            return res.status(404).send('Customer not found');
        }
        res.status(200).json(result[0]);
    });
});

// UPDATE: Update customer details
app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, dateOfBirth, address } = req.body;
    const query = `
        UPDATE Customers
        SET FullName = ?, Email = ?, PhoneNumber = ?, DateOfBirth = ?, Address = ?
        WHERE CustomerID = ?
    `;
    
    db.query(query, [fullName, email, phoneNumber, dateOfBirth, address, id], (err, result) => {
        if (err) {
            console.error('Error updating customer:', err.message);
            return res.status(500).send('Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Customer not found');
        }
        res.status(200).json({ message: 'Customer updated successfully' });
    });
});

// DELETE: Delete customer by ID
app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Customers WHERE CustomerID = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting customer:', err.message);
            return res.status(500).send('Server Error');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Customer not found');
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
