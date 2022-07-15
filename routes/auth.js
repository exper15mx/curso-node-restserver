const { Router } = require('express');
const { check, body, query } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);



module.exports = router;