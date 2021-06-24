const express = require('express'); //Import "express" (framework based on Node.js)
const bodyParser = require('body-parser'); //Extracts JSON object from POST requests
const mongoose = require('mongoose'); //Plugin Mongooose to connect to MongoDB database
const path = require('path'); //Plugin to upload images and manage files paths access
const helmet = require('helmet'); //Node.js module that helps in securing HTTP headers
const rateLimit = require("express-rate-limit"); //Use to limit repeated requests to public APIs and/or endpoints such as password reset.

require('dotenv').config();

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per windowMs
});

mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet()); //sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, etc.

app.use(limiter); //  apply to all requests

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