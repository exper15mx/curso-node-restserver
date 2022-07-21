
const { Router } = require('express');
const { check, body, query, param } = require('express-validator');

const { validarJWT, 
        validarCampos,
        tieneRole,
        esRoleValido
} = require('../middlewares');

const { existeProductoPorId,
        existeProductoPorNombre ,
        existeCategoriaPorId
} = require('../helpers/db-validators');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto
} = require('../controllers/productos');

const router = Router();

// Obtener todos las productos - público
router.get('/', [
        query("limite", "El valor de 'limite' debe ser numérico")
        .isNumeric()
        .optional(),
        query("desde", "El valor de 'desde' debe ser numérico")
        .isNumeric()
        .optional(),
        validarCampos,
], obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('categoria', 'La categoria es obligatoria').not().isEmpty(),
    body('categoria', 'No es un ID válido').isMongoId(),
    validarCampos
 ], crearProducto);

// Actualizar -privado - cualquier con token válido
router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('categoria', 'La categoria es obligatoria').not().isEmpty(),
    param('id', 'No es un ID válido').isMongoId(),
    body('categoria', 'No es un ID válido').isMongoId(),
    param('id').custom( existeProductoPorId ),
    body('nombre').custom( existeProductoPorNombre ),
    body('rol').optional().custom( esRoleValido ),
    validarCampos
], actualizarProducto);

// Borrar un producto por id - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);


module.exports = router;