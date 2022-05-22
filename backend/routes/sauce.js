const express = require('express');

const router = express.Router();

const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, sauceController.createSauce);

router.post('/:id/like', auth, sauceController.evaluateSauce);

router.put('/:id', auth, multer, sauceController.modifySauce);

router.delete('/:id', auth, sauceController.deleteSauce);

router.get('/:id', auth, sauceController.getOneSauce);

router.get('/', auth, sauceController.getSauces);



module.exports = router;