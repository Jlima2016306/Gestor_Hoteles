"use strict"

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    Nombre: String,
    Tipo: String,
    Descripcion: String,
    FechaInit: Date,
    FechaEnd: Date,
    NombreHotel: {type:Schema.Types.ObjectId, ref:"hoteles"}

})

module.exports= mongoose.model("evento", EventoSchema )