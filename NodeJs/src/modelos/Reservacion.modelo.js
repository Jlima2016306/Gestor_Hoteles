"use strict"

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var ReservacionSchema = Schema({
    fechaReservacion: Date,
    Usuario: {type:Schema.Types.ObjectId, ref: "usuario"},
    Habitacion: {type:Schema.Types.ObjectId, ref:"habitacion"},
    Hotel: {type:Schema.Types.ObjectId, ref:"hoteles"},
    FechaInit: Date,
    FechaEnd: Date,
    Dias: Number,
    PrecioReservacion: Number,
    Terminada: Boolean
})

module.exports = mongoose.model("Reservacion",ReservacionSchema);