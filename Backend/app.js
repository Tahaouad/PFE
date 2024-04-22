const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const SESSION_SECRET = 'YourSessionSecret';  // Assurez-vous de remplacer ceci par une véritable clé secrète dans un environnement de production

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001', // Assurez-vous que cette URL correspond à celle du client
    credentials: true
}));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const sequelize = new Sequelize('PFE', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Modèles
const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
});

const Etablissement = sequelize.define('Etablissement', {
    nom: DataTypes.STRING
});

const Formateur = sequelize.define('Formateur', {
    etablissementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Etablissement,
            key: 'id'
        }
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    matricule: DataTypes.STRING,
    type: DataTypes.STRING, // FP pour formateur permanent, FV pour formateur vacataire
    mhs: DataTypes.INTEGER, // 26 ou 36 heures par semaine
    nbrSemaine: DataTypes.INTEGER,
    metier: DataTypes.STRING,
    password: DataTypes.STRING
});

Etablissement.hasMany(Formateur, { foreignKey: 'etablissementId' });
Formateur.belongsTo(Etablissement, { foreignKey: 'etablissementId' });

// Routes
app.post('/user', async (req, res) => {
    const { username, email, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await User.create({ username, email, password: hashedPassword, phoneNumber });
        req.session.user = newUser;
        res.status(201).json({ username: newUser.username, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.get('/user', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    try {
        const user = req.session.user;
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.session.user = user;
        res.status(200).json({ message: 'Login successful' });
        
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error destroying session' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

sequelize.authenticate()
    .then(() => {
        console.log('=> Database connected');
        sequelize.sync()
            .then(() => {
                console.log('Database synchronized.');
                app.listen(PORT, () => {
                    console.log(`Server is running on port ${PORT}`);
                });
            })
            .catch(err => {
                console.error('Error syncing database:', err);
            });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
