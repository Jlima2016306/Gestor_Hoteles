"use strict"

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var HotelesSchema = Schema({
    Nombre: String,
    Direccion: String,
    Habitaciones: Number,
    Reservaciones: Number,
    DueñoUsuario: String
})

module.exports = mongoose.model("hoteles",  HotelesSchema)