const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const passwordValidator = require('password-validator');

const User = require('../models/user');

const schemaPassword = new passwordValidator();
schemaPassword
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().symbols(1)
    .has().not().spaces();

exports.signup = (req, res, next) => {
    if (schemaPassword.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: cryptoJs.SHA256(req.body.email, process.env.RANDOM_KEY_SECRET).toString(),
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(500).send(error));
    } else {
        throw("Le mot de passe doit contenir entre 8 et 20 caractères dont au moins une lettre majuscule, une lettre minusucle, deux chiffres et un symbole")
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJs.SHA256(req.body.email, process.env.RANDOM_KEY_SECRET).toString() })
        .then(user => {
            if (!user) {
                return res.status(404).send(new Error('Utilisateur non trouvé !'));
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(400).send(new Error('Mot de passe incorrect !'));
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.APP_SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).send(error));
        })
        .catch(error => res.status(500).send(error));
};

