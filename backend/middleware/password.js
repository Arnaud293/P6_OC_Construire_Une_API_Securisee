const PasswordValidator = require("password-validator");

const passwordSchema = new PasswordValidator();

passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(16)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    }
    else {
        console.log('Votre mot de passe doit contenir entre 8 et 16 caractères et contenir au moins 2 chiffres');
        return res
            .status(400)
            .json({ error: `${(passwordSchema.validate(req.body.password, { list: true }))};` })
    }
}