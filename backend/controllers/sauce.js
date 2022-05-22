const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
}

// exports.evaluateSauce = async (req, res, next) => {

//     try {

//         console.log(req.body);

//         let userId = req.body.userId;
//         let like = req.body.like;
//         let userLiked = Sauce.usersLiked;
//         let userDisliked = Sauce.usersDisliked;

//         switch (like) {
//             case 1:
//                 if ((userLiked === userLiked.include(userId))) {
//                     return userLiked;
//                 } else {
//                     userDisliked.addToSet(userId)
//                 }
//                 userDisliked = userDisliked.filter((element) => element !== userId);
//                 break;
//             case -1:
//                 if ((userDisliked === userDisliked.include(userId))) {
//                     return userDisliked;
//                 } else {
//                     userLiked.addToSet(userId)
//                 }
//                 userLiked = userLiked.filter((element) => element !== userId);
//                 break;
//             case 0:
//                 userDisliked = userDisliked.filter((element) => element !== userId);
//                 userLiked = userLiked.filter((element) => element !== userId);
//                 break;
//             default: throw res.status(400).json({ error });
//         }

//         await Sauce.updateOne({
//             userLiked: userLiked,
//             userDisliked: userDisliked,
//             likes: userLiked.length,
//             dislikes: userDisliked.length
//         });
//         res.status(200).json({ message: 'Evaluation mise à jour avec succès !' })
//     }
//     catch (error) { res.status(400).json({ error }) };

// }

exports.evaluateSauce = (req, res, next) => {

    switch (req.body.like) {
        // Si l'utilisateur à déja évaluer la sauce
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    // Si like = 1 on enlève le like (-1)
                    if (sauce.usersLiked.filter(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(res.status(200).json({ message: 'Evaluation mise à jour avec succès !' }))
                            .catch(error)(res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.filter(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(res.status(200).json({ message: 'Evaluation mise à jour avec succès' }))
                            .catch(error)(res.status(400).json({ error }));
                    }
                })
                .catch((error) => res.status(400).json({ error }));
            break;
        case 1:
            if (Sauce.usersLiked.filter(user => user !== req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $pull: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                    .then(res.status(200).json({ message: 'Like ajouté' }))
                    .catch(res.status(400).json({ error }));
                break;
            }
        case -1:
            if (Sauce.usersDisliked.filter(user => user !== req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: 1 },
                    $pull: { usersDisliked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
                    .catch((error) => res.status(400).json({ error }));
                break;
            }

        default: throw res.status(400).json({ error });
    }


}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}