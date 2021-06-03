const express = require('express'); //Import "express" (framework based on Node.js)
const bodyParser = require('body-parser'); //Extracts JSON object from POST requests
const mongoose = require('mongoose'); //Plugin Mongooose to connect to MongoDB database
const path = require('path'); //Plugin to upload images and manage files paths access
const helmet = require('helmet'); //Node.js module that helps in securing HTTP headers

const saucesRoutes = require('./routes/sauces'); 
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://o2caledonie:WjgjWxuzzdxWdJ42@cluster0.7p67r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet()); //sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, etc.

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //API access from all origins
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Add headers mentionned in requests sent to API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Authorized methods for HTTP requests
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));//Download images from 'images' directory 

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;