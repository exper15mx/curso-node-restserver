
const { Router } = require('express');
const { check, body, query, param } = require('express-validator');

/*const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');*/

const { validarCampos, 
        validarJWT, 
        esAdminRole,
        tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', [
        query("limite", "El valor de 'limite' debe ser numérico")
        .isNumeric()
        .optional(),
        query("desde", "El valor de 'desde' debe ser numérico")
        .isNumeric()
        .optional(),
        validarCampos,
],usuariosGet);

router.put('/:id', [
        param('id', 'No es un ID válido').isMongoId(),
        param('id').custom( existeUsuarioPorId ),
        body('rol').optional().custom( esRoleValido ),
        validarCampos
],usuariosPut); 

//El segundo argumento se usa para los middleware antes de que se mande la ruta, si son varios
//Se manda un arreglo de middlewares
router.post('/', [
        body('nombre', 'El nombre es obligatorio').not().isEmpty(),
        body('password', 'El password debe de ser más de 6 letras').isLength({ min:6 }),
        body('correo', 'El correo no es válido').isEmail(),
        body('correo').custom( emailExiste ),
        //body('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        //body('rol').custom( (rol) => esRoleValido(rol)),
        body('rol').custom( esRoleValido ),
        validarCampos
], usuariosPost);

router.delete('/:id', [
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        param('id', 'No es un ID válido').isMongoId(),
        param('id').custom( existeUsuarioPorId ),
        validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;