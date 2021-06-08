const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log('ok')
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.rateSauce = (req, res, next) => {
    if (req.body.like === 1) { // if like sauce
        Sauce.updateOne({
            _id: req.params.id
        }, {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: +1 },
        })
            .then(() => res.status(200).json({ message: 'j\'aime cette sauce !' }))
            .catch((error) => res.status(400).json({ error }))
    }
    if (req.body.like === -1) { // if dislike sauce
        Sauce.updateOne({
            _id: req.params.id
        }, {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: +1 },
        })
            .then(() => res.status(200).json({ message: 'je n\'aime pas cette sauce !' }))
            .catch((error) => res.status(400).json({ error }))
    }
    if (req.body.like === 0) { // to cancel rating
        Sauce.findOne({
            _id: req.params.id
        })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) { // to cancel a "like"
                    Sauce.updateOne({
                        _id: req.params.id
                    }, {
                        $pull: { usersLiked: req.body.userId },
                        $inc: { likes: -1 },
                    })
                        .then(() => res.status(200).json({ message: 'J\'annule mon vote !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.includes(req.body.userId)) { // to cancel a "dislike"
                    Sauce.updateOne({
                        _id: req.params.id
                    }, {
                        $pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: -1 },
                    })
                        .then(() => res.status(200).json({ message: 'J\'annule mon vote !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(404).json({ error }))
    }
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}