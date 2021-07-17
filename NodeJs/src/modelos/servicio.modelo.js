"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ServicioSchema = Schema({
    Nombre: String,
    Descripcion: String,
    Precio: Number,
    Hotel: {type:Schema.Types.ObjectId, ref: "hoteles"}
})

module.exports = mongoose.model("Servicio", ServicioSchema);