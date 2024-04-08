const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const session = require('express-session');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use(express.json());

const sequelize = new Sequelize('PFE', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
});

const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: sessionSecret ,
    resave: false,
    saveUninitialized: false
}));

app.post('/user', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await User.create({ username, email, password, phoneNumber });
        req.session.user = newUser; 
        console.log(req.session.user)
        res.status(201).json({ username: newUser.username, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.get('/user', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        const user = req.session.user;

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login credentials:', username, password);
    try {
        const user = await User.findOne({ where: { username, password } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
        } else {
            req.session.user = user; 
            console.log("User login : ",req.session.user)
            res.status(200).json({ message: 'Login successful' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error destroying session' });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


sequelize.authenticate().then(() => {
    console.log('=> Database connected');
    sequelize.sync().then(() => {
        console.log('Database synchronized.');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }).catch(err => {
        console.error('Error syncing database:', err);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
