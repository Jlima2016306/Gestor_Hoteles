"use strict"

var Hoteles = require("../modelos/hoteles.modelo");
var Usuario= require("../modelos/usuario.model");
var Habitacion = require("../modelos/habitacion.modelo")
var Reservacion = require("../modelos/Reservacion.modelo")


//CREAR HOTELES
function AgregarHoteles(req,res){
var ModeloHoteles= new Hoteles()
var params = req.body

    if(req.user.rol === "ROL_ADMIN"){
        if(params.Nombre && params.Direccion && params.DuennoUsuario){
          ModeloHoteles.Nombre = params.Nombre;
          ModeloHoteles.Direccion = params.Direccion;
          ModeloHoteles.Habitaciones = 0;
          ModeloHoteles.Reservaciones = 0
          ModeloHoteles.DueñoUsuario = params.DuennoUsuario;
        
        
        Hoteles.find({$or: [
                            {Nombre: ModeloHoteles.Nombre},
                            {Direccion: ModeloHoteles.Direccion},
                            {DueñoUsuario: ModeloHoteles.DueñoUsuario}]}).exec((err, HotelObtenido)=>{
            if (err) return res.status(500).send({mensaje:"Error al encontrar el hotel"});
            if (!HotelObtenido) return res.status(500).send({mensaje:"Error al agregar hotel"})
            if(HotelObtenido.length > 0) return res.status(500).send({mensaje:"Ya hay hoteles con las mismas caracteristicas"})

           Usuario.find({ Usuario: ModeloHoteles.DueñoUsuario ,rol: "ROL_DUEÑO" }).exec((err, usuariosEncontrados)=>{
            if (err) return res.status(500).send({mensaje:"Error al buscar el usuario"})
            if (!usuariosEncontrados) return res.status(500).send({mensaje:"No se encontro el dueño usuario"})
            if(usuariosEncontrados.length > 0){

                ModeloHoteles.save((err, Saved)=>{
                    if(err) return res.status(500).send({mensaje:"Error"})
                    if(!Saved) return res.status(500).send({mensaje:"Error al Guardar el Hoteles"})

                    return res.status(200).send({Saved})
                })  

            }else{
                return res.status(500).send({mensaje:"No se encontro el Usuario  o no es usuario con rol Dueño"})
            }

           })
        })


        }else{
            return res.status(500).send({mensaje:"No se enviaron todos los parametos, estos son: Nombre, direccion e idUsuario dueño"})
        }
    }else{
        return res.status(500).send({mensaje:"Solo el administrador, puede agregar hoteles. Si usted requiere ser dueño de un hotel, hablar con el administrador"})
    }

}


//VER HOTELES
function obtenerHoteles(req,res){
    Hoteles.find().exec((err, HotelObtenidos)=>{
        if(err) return res.status(500).send({mensaje:"Error"})
        if(!HotelObtenidos) return res.status(500).send({mensaje:"No se encontro nada"})
        return res.status(200).send({HotelObtenidos})
    })

}

//BUSCAR HOTELES NOMBRE/DIRECCION
function obtenerHotelesNombre(req,res){
    var NombreHotel = req.params.Nombre;

    Hoteles.find({$or:[{Nombre: NombreHotel},{Direccion:NombreHotel} ]}).exec((err, HotelObtenidos)=>{
        if(err) return res.status(500).send({mensaje:"Error"})
        if(!HotelObtenidos) return res.status(500).send({mensaje:"No se encontro nada"})
        console.log("si se pudo burro")
        return res.status(200).send({HotelObtenidos})
    })

}









//EDITAR HOTELES 

function  editarHotel(req,res){
    var ID = req.params.id;
    var params = req.body;
     console.log(ID)
    if(req.user.rol === "ROL_CLIENTE" ) return res.status(500).send({mensaje:"Solo el admin del hotel PUEDE MODIFICAR! "})
    Hoteles.find({$or: [
        {Nombre: params[0].Nombre},
        {Direccion: params[0].Direccion},
        {DueñoUsuario: params[0].DueñoUsuario}]}).exec((err, HotelObtenido)=>{


            if(err) return res.status(500).send({mensaje:"Error al actualizar"})
        if(HotelObtenido.length > 0 && HotelObtenido[0].DueñoUsuario != params[0].DueñoUsuario) return res.status(500).send({mensaje:"Ya hay hoteles con esas caracteristicas"})
        if(params.DueñoUsuario && req.user.rol === "ROL_ADMIN"){
           Usuario.find({ Usuario: params.DueñoUsuario }).exec((err, usuariosEncontrados)=>{
                if(err) return res.status(500).send({mensaje:"Error al validar Dueño"})
                if(usuariosEncontrados.length == 0) return res.status(500).send({mensaje:"Ese usuario no existe"})
                console.log(usuariosEncontrados.length)
                Hoteles.findByIdAndUpdate(ID,  params, {new:true},(err, HotelActualizado)=>{

                    
                    if (err) return res.status(500).send({mensaje:"Error al Actualizar hotel"})

                    if(!HotelActualizado) return res.status(500).send({mensaje:"No se pudo actualizar"})
                    return res.status(200).send({HotelActualizado})
                })
            })
        }else{

                delete params[0].DueñoUsuario
                Hoteles.findByIdAndUpdate(ID,  {Nombre: params[0].Nombre, Direccion: params[0].Direccion} , {new:true},(err, HotelActualizado)=>{

                    
                    if (err) return res.status(500).send({mensaje:"Error al Actualizar hotel"})
                    if(!HotelActualizado) return res.status(500).send({mensaje:"No se pudo actualizar"})
                    return res.status(200).send({HotelActualizado})
                })
            
        }

    })
}

//ELIMINAR HOTELES

function eliminarHotel(req,res){
    var Nombre = req.params.Nombre;
    var params = req.body;
    if(req.user.rol != "ROL_DUEÑO" ) return res.status(500).send({mensaje:"Solo el admin PUEDE MODIFICAR! "})

    Hoteles.find({Nombre:Nombre},(err, Hotel)=>{
        if(err) return res.status(500).send({mensaje: "Error al buscar el hotel"})
        if(!Hotel) return res.status(500).send({mensaje: "Error al buscar hotel o ya fue  eliminado"})
        console.log(Hotel[0]._id)
    Habitacion.find({NombreHotel : Hotel[0]._id }, (err, Habitaciones)=>{
        if(err) return res.status(500).send({mensaje: "Error"})
        if(!Habitaciones ) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})

        Reservacion.find({Hotel : Hotel[0].id },(err, ReservacionExistentes)=>{
            console.log(Habitaciones)

            for(var i=0 ; i < Habitaciones.length; i++){


                for(var e=0 ; e < ReservacionExistentes.length; e++){
                    var Reservacion =String(ReservacionExistentes[e].Habitacion) 
                    var Habitacions = String(Habitaciones[i]._id)

                    if(Reservacion === Habitacions) {

                        console.log(ReservacionExistentes[e].Habitacion)

                       var Fecha = new Date(ReservacionExistentes[e].FechaEnd)
                        var FechaI = new Date(ReservacionExistentes[e].FechaInit)
                        var FechaActual = new Date()

                        if(Fecha.getTime()> FechaActual.getTime()) return res.status(500).send({mensaje: "No se puede eliminar, una habitacion que tiene reservaciones sin culminar la estadia "})
                    }
                }
            }














    Hoteles.findOneAndDelete({_id: Hotel[0]._id},(err, HotelEliminado)=>{




        if(err) return res.status(500).send({mensaje:"Error al eliminar el hotel"})
        if(!HotelEliminado) return res.status(500).send({mensaje:"error al eliminar el hotel"})

        return res.status(200).send({HotelEliminado})

    })


})

    })

})


}


//Reservaciones porcentaje Hoteles

function  porcentajeHoteles(req, res){
    Hoteles.find({},(err, Hoteles)=>{
        if(err) return res.status(500).send({mensaje:"error"})
        if(!Hoteles) return res.status(500).send({mensaje:"error al buscar"})
        var PorcentajeHotel = []
        var Total = 0;
        for(var i=0; i < Hoteles.length; i++ ){

            Total= Number(Total) + Number(Hoteles[i].Reservaciones)

        }

        console.log(Total)
        for(var i=0; i < Hoteles.length; i++ ){
            var NumeroHotel = ((Hoteles[i].Reservaciones * 100)/Total)

            PorcentajeHotel[i] = { NombreHotel: Hoteles[i].Nombre, 
                Porcentaje: NumeroHotel.toFixed(2),
                Reservaciones: Hoteles[i].Reservaciones

                }

        


        }

        return res.status(200).send({PorcentajeHotel})

    })
}


module.exports = {AgregarHoteles, obtenerHotelesNombre, obtenerHoteles, editarHotel, eliminarHotel,porcentajeHoteles}