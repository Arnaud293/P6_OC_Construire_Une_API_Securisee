const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Security add-on ---------------------------------
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const limiter = require('./middleware/rateLimiter');
const { default: rateLimit } = require('express-rate-limit');

require('dotenv').config();


const app = express();

app.use(helmet());

// app.use(rateLimit);

app.use(mongoSanitize());

const DB = {
    DB_ID: process.env.DB_ID,
    DB_ADDRESS: process.env.DB_ADDRESS,
    DB_MDP: process.env.DB_MDP,
}

// -------------------------------------------------

mongoose.connect(`mongodb+srv://${DB.DB_ID}:${DB.DB_MDP}@${DB.DB_ADDRESS}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.use((req, res) => {
//     res.json({ message: 'Votre requête a bien été reçue !' });
// });

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;