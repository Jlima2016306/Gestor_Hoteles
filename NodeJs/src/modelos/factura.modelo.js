"use strict"

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var FacturaShema = Schema({
    Usuario: {type:Schema.Types.ObjectId, ref: "usuario"},
    Hotel: {type:Schema.Types.ObjectId, ref:"hoteles"},
    idReservacion: {type:Schema.Types.ObjectId, ref:"Reservacion"},

    FacturaEditable: Boolean,
    
    Carrito:{type:Schema.Types.ObjectId, ref:"carritoServicios"},
    PrecioServicios: Number,
    PrecioReservacion: Number,


    Total: String,

})

module.exports = mongoose.model("factura", FacturaShema);