const express = require('express');
require('dotenv').config();
const app = express();
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


app.use(express.json());

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

//middleware
const authenticateToken = (req, res, next) => {
    const rawtoken = req.header('Authorization');
    const token = rawtoken.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).send('Invalid Token');
    }
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/', (req, res) => {
    res.send('Hello, Team!');
});

//register user
app.post("/register", async (req, res) => {
    const {name, email, password, role, account_name} = req.body;
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
    }
    if (!name || !password || !role) {
        return res.status(400).json({ error: 'Please provide username, password, and role' });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(hashedPassword);
    try {
        const result = await pool.query("INSERT INTO users (name, email, password, role, account_name) VALUES($1, $2, $3, $4, $5)", [name, email, hashedPassword, role, account_name]);
        const user = result.rows[0];
        res.status(200).json({message:"user created successfully"})
    } catch (error) {
        res.status(400).json({ error: 'Internal Server Error' });
    }
})


//login a user
app.post('/login',async (req, res) => {
    const {password, email} = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if(!user) return res.status(404).json({message: "Access denied"});

        const decryptedPassword = await bcrypt.compare(password, user.password)
        if(!decryptedPassword) return res.status(404).json({message: "Invalid password"});

        const jwtToken = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET);
        res.header('Authorization', jwtToken).json({jwtToken});
        res.status(200).json({message: "Logged in successfully"})
    } catch (error) {
        res.status(400).json({message: "unable to login"})
    }
})

// add a barber profile
app.post('/barbers', authenticateToken, async (req, res) => {
    if(req.user.role !== 'barber') return res.status(403).json({error: "Invalid role"})
    const { name, location, barber_shop_name, expertise, phone_number, account_name } = req.body;
    try {
        const existingBarber = await pool.query("SELECT * FROM barbers WHERE account_name = $1", [account_name]);
        if(existingBarber.rows.length > 0) {
            return res.status(400).json({ error: 'Barber already exists' });
        }else{
            const barbers = await pool.query("INSERT INTO barbers (name, user_id, location, barber_shop_name, expertise, phone_number, account_name) VALUES ($1, $2, $3, $4, $5, $6, $7)", [name, req.user.id, location, barber_shop_name, expertise, phone_number, account_name]);
            return res.status(200).json(barbers);
        }
    } catch (error) {
        console.error(error);
    }
});

//add a review
app.post('/review', authenticateToken, async (req, res) => {
    if(req.user.role !== 'customer') return res.status(403).json({error: "Invalid role"});
     const { barber_id, style, rating, review_text, image_url } = req.body;
     if (!barber_id || !style || !rating || !review_text) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        const review = await pool.query('INSERT INTO reviews (user_id, barber_id, style, rating, review_text, image_url) VALUES ($1, $2, $3, $4, $5, $6)', [req.user.id, barber_id, style, rating, review_text, image_url]);
        return res.status(201).json({ message: 'Review posted successfully', review });
    } catch (error) {
        return res.status(500).json({ error: 'Error posting review' });
    }
})


//see a particular barber reviews
app.get('/barbers/:id/reviews', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query("SELECT * FROM reviews WHERE barber_id = $1", [id]);
        const review = result.rows[0];
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({error: "Failed to get reviews"})
    }
});

// search for a paricular barber or review by name or city
app.get('/search', async (req, res) => {
    const {q} = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Query parameter is missing' });
    }
    try {
        const barbers = await pool.query("SELECT * FROM barbers WHERE name ILIKE $1 OR location ILIKE $1", [q]);
        const reviews = await pool.query("SELECT * FROM reviews WHERE style ILIKE $1", [q]);
        res.status(200).json({ barbers: barbers.rows, reviews: reviews.rows });
    } catch (error) {
        res.status(500).json({error: "Failed to get barber or review"})
    }
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// I made it very detailed because of cozmo since she isn't familair with node