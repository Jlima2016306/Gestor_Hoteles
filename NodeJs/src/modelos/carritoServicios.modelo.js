"use strict"

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var carritoServiciosShema = Schema({
    Usuario: {type:Schema.Types.ObjectId, ref: "usuario"},
    Hotel: {type:Schema.Types.ObjectId, ref:"hoteles"},

    CarritoFacturado : Boolean,

    Carrito:[{
                Nombre: String,
                Descripcion : String,
                Precio: String 
    }],
    PrecioServicios: Number,

})

module.exports = mongoose.model("carritoServicios", carritoServiciosShema);