"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HabitacionSchema = Schema({
    Nombre: String,
    Disponible: Boolean,
    Descripcion: String,
    FechaInit: String,
    FechaEnd: String,
    PrecioNoche: Number,
    NombreHotel: String
})

module.exports = mongoose.model("habitacion", HabitacionSchema);