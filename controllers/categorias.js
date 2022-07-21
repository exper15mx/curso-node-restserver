const { response } = require("express");
const { Categoria } = require('../models');


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))    
            .limit(Number(limite))
            //.populate("usuario")
            .populate('usuario', 'nombre')
    ])

    res.json({       
        total,
        categorias
    })
}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoriaDB = await Categoria.findById( id ).populate('usuario', 'nombre');
    
    /*const categoriaDB = await Promise.all([
        Categoria.findById( id )
            .populate("usuario")
    ]);*/

    res.json({       
        categoriaDB
    })

}

const crearCategoria = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria ( data );

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    /*const nombre = req.body.nombre.toUpperCase();

    const categoria = await Promise.all([
        Categoria.findByIdAndUpdate(id, { nombre: nombre }, {new:true} )
                 .populate("usuario")
    ]);*/

    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }).populate('usuario', 'nombre');
    
    res.json(categoria)
}

// borrarCategoria - estado:false

const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;

    //Cambiar estado de la categoría (borrado lógico)
    /*const categoria = await Promise.all([
        Categoria.findByIdAndUpdate(id, { estado: false }, {new:true} )
                 .populate("usuario")
    ]);*/

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true }).populate('usuario', 'nombre');

    res.json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}