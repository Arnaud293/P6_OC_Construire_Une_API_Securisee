const express = require("express");

// Intégration du router

const router = express.Router();

// Déclaration des constantes

const sauceController = require("../controllers/sauce");
const auth = require("../middleware/auth");
const checkUser = require("../middleware/checkUser");
const multer = require("../middleware/multer-config");

// CRUD

router.post("/", auth, multer, sauceController.createSauce);

router.post("/:id/like", auth, sauceController.evaluateSauce);

router.put("/:id", checkUser, multer, sauceController.modifySauce);

router.delete("/:id", checkUser, sauceController.deleteSauce);

router.get("/:id", auth, sauceController.getOneSauce);

router.get("/", auth, sauceController.getSauces);

module.exports = router;
