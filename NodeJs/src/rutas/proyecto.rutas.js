"use strict"

var express = require("express");
var UsuarioControlador = require("../controladores/usuario.controlador");
var HotelesControlador = require("../controladores/hoteles.controlador")
var HabitacionControlador = require("../controladores/habitacioon.controlador")
var EventoControlador = require("../controladores/evento.controlador")
var ServicioControlador = require("../controladores/servicio.controlador")
var ReservacionControlador = require("../controladores/reservacion.controlador")
var carritoServiciosControlador = require("../controladores/carritoServicios.controlador")
var FacturaControlador = require("../controladores/factura.controlador")

var md_autorizacion = require("../middlewares/authenticated.js");

//RuTasss
var api = express.Router()
    //Usuario
api.post("/registrar", UsuarioControlador.registrar)//
api.get("/obtenerUsuarios", md_autorizacion.ensureauth ,UsuarioControlador.obtenerUsuario)//
api.post("/login", UsuarioControlador.login)//
api.get("/obtenerUsuarioID/:iDUsuario", md_autorizacion.ensureauth ,UsuarioControlador.obtenerUsuarioID)//
api.put("/editarUsuario/:id", md_autorizacion.ensureauth, UsuarioControlador.editarUsuario)//
api.put("/eliminarUsuario/:nombre",md_autorizacion.ensureauth, UsuarioControlador.EliminarUsuario)//

   //Hoteles

api.post("/agregarHoteles", md_autorizacion.ensureauth, HotelesControlador.AgregarHoteles)//
api.get("/Buscarhoteles/:Nombre",  HotelesControlador.obtenerHotelesNombre)//
api.get("/obtenerHotel", HotelesControlador.obtenerHoteles)//
api.put("/editarHoteles/:id", md_autorizacion.ensureauth, HotelesControlador.editarHotel)//
api.put("/eliminarHotel/:Nombre", md_autorizacion.ensureauth, HotelesControlador.eliminarHotel)//
api.get("/porcentajeHoteles", md_autorizacion.ensureauth,HotelesControlador.porcentajeHoteles )

// habitacion

api.post("/agregarHabitacion", md_autorizacion.ensureauth, HabitacionControlador.agregarHabitacion)//
api.get("/obtenerHabitacion/:nombre", md_autorizacion.ensureauth, HabitacionControlador.obtenerHabitaciones)//
api.put("/editarHabitacion/:id", md_autorizacion.ensureauth, HabitacionControlador.editarHabitaciones)//
api.put("/eliminarHabitacion/:id", md_autorizacion.ensureauth, HabitacionControlador.eliminarHabitacion)//
api.get("/buscarUsuarioHospedado", md_autorizacion.ensureauth,HabitacionControlador.buscarUsuarioHospedado )//
api.get("/obtenerHabitacionID/:id", md_autorizacion.ensureauth, HabitacionControlador.obtenerHabitacionID)//
//Eventos

api.post("/agregarEvento", md_autorizacion.ensureauth, EventoControlador.agregarEvento)//
api.get("/obtenerEvento/:nombre", md_autorizacion.ensureauth, EventoControlador.obtenerEvento)//
api.get("/obtenerEventoID/:id", md_autorizacion.ensureauth, EventoControlador.obtenerEventoId)//
api.post("/EditarEvento/:id", md_autorizacion.ensureauth, EventoControlador.editarEvento)//
api.put("/EliminarEvento/:id", md_autorizacion.ensureauth, EventoControlador.EliminarEvento)//

//Servicios
api.post("/agregarServicio", md_autorizacion.ensureauth, ServicioControlador.agregarServicio)//
api.get("/obtenerServicio/:nombre", md_autorizacion.ensureauth, ServicioControlador.obtenerServicio)//
api.get("/obtenerServicioID/:id", md_autorizacion.ensureauth, ServicioControlador.obtenerServicioId)//
api.post("/EditarServicio/:id", md_autorizacion.ensureauth, ServicioControlador.editarServicio)//
api.put("/EliminarServicio/:id", md_autorizacion.ensureauth, ServicioControlador.EliminarServicio)//



//Reservacion / obtenerMesesBloqueados mostrarHistorialServicios

api.post("/agregarReservacion", md_autorizacion.ensureauth,ReservacionControlador.agregarReservacion)//
api.get("/obtenerReservacion", md_autorizacion.ensureauth,ReservacionControlador.obtenerReservacion)//
api.post("/obtenerMesesBloqueados/:id", md_autorizacion.ensureauth,ReservacionControlador.obtenerMesesBloqueados)//
api.get("/obtenerReservacionActiva", md_autorizacion.ensureauth,ReservacionControlador.obtenerReservacionActiva)//
api.put("/EliminarReservacion/:id", md_autorizacion.ensureauth, ReservacionControlador.EliminarReservacion)//
api.get("/mostrarHistorialHoteles", md_autorizacion.ensureauth,ReservacionControlador.mostrarHistorialHoteles)//



//Carrito 


api.post("/carrito", md_autorizacion.ensureauth, carritoServiciosControlador.agregarCarritoServicios)//
api.get("/HistorialServicios", md_autorizacion.ensureauth, carritoServiciosControlador.mostrarHistorialServicios)
api.get("/carritoEnProceso/:id", md_autorizacion.ensureauth, carritoServiciosControlador.carritoEnProceso)//


//facura

api.post("/Facturar", md_autorizacion.ensureauth, FacturaControlador.agregarFactura)//
api.get("/ObtenerFacturas", md_autorizacion.ensureauth, FacturaControlador.obtenerFactura)
api.get("/PDF/:id", md_autorizacion.ensureauth, FacturaControlador.PDF)






//adminFacturar/:id
module.exports = api;
