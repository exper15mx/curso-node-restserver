const { response } = require("express");
const { Producto } = require('../models');

const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))    
            .limit(Number(limite))
            //.populate("usuario")
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.json({       
        total,
        productos
    })
}

const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;

    const productoDB = await Producto.findById( id )
                                     .populate('usuario', 'nombre')
                                     .populate('categoria', 'nombre');

    res.json({       
        productoDB
    })

}

const crearProducto = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoria = req.body.categoria;

    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ){
        return res.status(400).json({
            msg: `El Producto ${ productoDB.nombre }, ya existe`
        });
    }

    const { precio = 0, descripcion = '', disponible = true } = req.body;

    // Generar la data a guardar
    const data = {
        nombre,
        categoria,
        usuario: req.usuario._id,
        precio,
        descripcion,
        disponible
    }

    const producto = new Producto ( data );

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
                                     .populate('usuario', 'nombre')
                                     .populate('categoria', 'nombre');
    
    res.json(producto)
}

const borrarProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }).populate('usuario', 'nombre');

    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}