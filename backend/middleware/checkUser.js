require("dotenv").config();
const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");

// Vérification de l'utilisateur sans la requête dans le body pour les routes PUT/DELETE

module.exports = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "RANDOM_SECRET_TOKEN");
      const userId = decodedToken.userId;

      if (sauce.userId && sauce.userId !== userId) {
        res.status(403).json({ message: "Requête bloquée" });
      } else {
        next();
      }
    })
    .catch((error) => {
      res.status(401).json({ error });
    });
};
