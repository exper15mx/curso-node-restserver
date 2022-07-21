
const { Router } = require('express');
const { check, body, query, param } = require('express-validator');

const { validarJWT, 
        validarCampos,
        tieneRole,
        esRoleValido
} = require('../middlewares');

const { existeCategoriaPorId,
        existeCategoriaPorNombre 
} = require('../helpers/db-validators');

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria
} = require('../controllers/categorias');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorías - público
router.get('/', [
        query("limite", "El valor de 'limite' debe ser numérico")
        .isNumeric()
        .optional(),
        query("desde", "El valor de 'desde' debe ser numérico")
        .isNumeric()
        .optional(),
        validarCampos,
], obtenerCategorias);

// Obtener una categoría por id - público
router.get('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], crearCategoria);

// Actualizar -privado - cualquier con token válido
router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom( existeCategoriaPorId ),
    body('nombre').custom( existeCategoriaPorNombre ),
    body('rol').optional().custom( esRoleValido ),
    validarCampos
], actualizarCategoria);

// Borrar una categoría por id - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);


module.exports = router;