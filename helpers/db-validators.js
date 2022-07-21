const { Categoria, 
        Producto,
        Role,
        Usuario
} = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ){
            throw new Error(`El rol ${ rol } no está registrado en la BD`)
    }
}

//Verificar si el correo existe
const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ){
        throw new Error(`El correo: ${ correo } ya está registrado`)
    }
}

//Verificar si el usuario existe
const existeUsuarioPorId = async(id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ){
        throw new Error(`El usuario con id: ${ id } no existe`)
    }
}

const existeCategoriaPorId= async( id = '') => {
    
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ){
        throw new Error(`La categoría con id: ${ id } no existe`)
    }
}

const existeCategoriaPorNombre= async( nombre = '') => {

    const nombreUpper = nombre.toUpperCase();

    const existeCategoria = await Categoria.findOne({ nombre: nombreUpper });
    if ( existeCategoria ){
        throw new Error(`La categoría con el nombre: ${ nombreUpper } ya existe`)
    }
}

const existeProductoPorId= async( id = '') => {
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ){
        throw new Error(`La producto con id: ${ id } no existe`)
    }
}

const existeProductoPorNombre= async( nombre = '') => {

    const nombreUpper = nombre.toUpperCase();

    const existeProducto = await Producto.findOne({ nombre: nombreUpper });
    if ( existeProducto ){
        throw new Error(`El producto con el nombre: ${ nombreUpper } ya existe`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeCategoriaPorNombre,
    existeProductoPorId,
    existeProductoPorNombre
}