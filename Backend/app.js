const express = require('express')
const cors = require('cors')
const { Sequelize ,DataTypes } = require('sequelize')

const app = express()

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}))  
  
app.use(express.json())

const sequelize = new Sequelize('PFE', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  })

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
})



app.post('/user', async (req, res) => {    
    try {
      const { username, email, password,phoneNumber } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const newUser = await User.create({ username, email, password, phoneNumber});
      res.status(201).json({ username: newUser.username,message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login credentials:', username, password);
    try {
      const user = await User.findOne({ where: { username, password } });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
      } 
        res.status(200).json({ message: 'Login successful' });
    }
      catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });




sequelize.authenticate().then(() => {
    console.log('=> Database connected')
    sequelize.sync()
      .then(() => {
        console.log('Database synchronized.')
        app.listen(3000, () => {
          console.log('Server is running on port 3000')
        })
      })
      .catch(err => {
        console.error('Error syncing database:', err)
      })
  })    
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })