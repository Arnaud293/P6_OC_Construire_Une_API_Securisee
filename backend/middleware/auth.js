const jwt = require("jsonwebtoken");
// const UserModel = require("../models/user");

// Authentification = récupération du token

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User Id non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};

// module.exports.checkUser = (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (token) {
//     jwt.verify(token, "RANDOM_TOKEN_SECRET", async (error, decodedToken) => {
//       if (error) {
//         res.locals.user = null;
//         res.cookie("jwt", "", { maxAge: 1 });
//         next();
//       } else {
//         let user = await UserModel.findById(decodedToken.id);
//         res.locals.user = user;
//         console.log(res.locals.user);
//         next();
//       }
//     });
//   } else {
//     res.locals.user = null;
//     next();
//   }
// };
