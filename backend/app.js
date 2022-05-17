const express = require('express');

const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://Arnaud2935:Bravo5678@cluster0.h9r2j.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;