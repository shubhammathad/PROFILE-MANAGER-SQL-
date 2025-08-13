import express from 'express';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './models/db.js'; // MySQL connection

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "/public")));

// Home page
app.post('/delete/:id', async (req, res) => {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect("/read");
});

app.get('/', (req, res) => {
    res.render("index");
});

// Read all users
app.get('/read', async (req, res) => {
    const [users] = await pool.query('SELECT * FROM users');
    res.render("read", { users });
});

// Delete user
app.get('/delete/:id', async (req, res) => {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect("/read");
});

// Edit page
app.get('/edit/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send("User not found");
    res.render("edit", { user: rows[0] });
});

// Update user
app.post('/update/:id', async (req, res) => {
    const { image, name, email } = req.body;
    await pool.query(
        'UPDATE users SET image = ?, name = ?, email = ? WHERE id = ?',
        [image, name, email, req.params.id]
    );
    res.redirect("/read");
});

// Create new user
app.post('/create', async (req, res) => {
    const { name, email, image } = req.body;
    await pool.query(
        'INSERT INTO users (name, email, image) VALUES (?, ?, ?)',
        [name, email, image]
    );
    res.redirect("/read");
});

app.listen(3000, () => console.log("Server running on port 3000"));
