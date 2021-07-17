const { Model } = require('mongoose')
var Habitacion = require('../modelos/habitacion.modelo')
var Hoteles = require('../modelos/hoteles.modelo')
var Reservacion = require('../modelos/Reservacion.modelo')


//Agregar habitacion

function agregarHabitacion(req, res){
    var ModeloHabitacion = new Habitacion()
    var params = req.body


    console.log(params)

    if(req.user.rol === "ROL_ADMIN" || req.user.rol === "ROL_CLIENTE") return res.status(500).send({mensaje:"Solo el DUEÑO puede agregar habitaciones"})
    if(params.Nombre && params.PrecioNoche && params.NombreHotel && params.Descripcion){
     ModeloHabitacion.Nombre = params.Nombre;
     ModeloHabitacion.PrecioNoche = params.PrecioNoche;
     ModeloHabitacion.NombreHotel = params.NombreHotel;
     ModeloHabitacion.Descripcion = params.Descripcion;
     ModeloHabitacion.Disponible = true
     ModeloHabitacion.FechaEnd = "Ahora"
     ModeloHabitacion.FechaInit = "Ahora"




        Habitacion.find({Nombre: ModeloHabitacion.Nombre, NombreHotel: ModeloHabitacion.NombreHotel }).exec((err, Habitacion)=>{

            if(err) return res.status(500).send({mensaje: "Error al agregar habitacion "})
            if(Habitacion.length > 0) return res.status(500).send({mensaje: "Ya existe esa habitacion"})

            Hoteles.find({_id : ModeloHabitacion.NombreHotel, DueñoUsuario : req.user.Usuario }).exec((err, HotelExiste)=>{
                if(err) return res.status(500).send({mensaje: "Error con el nombre hotel "})
                if(HotelExiste.length === 0) return res.status(500).send({mensaje:"Error con el nombre hotel"})
                
                ModeloHabitacion.save((err, Saved)=>{
                    if(err) return res.status(500).send({mensaje:"Error"})
                    if(!Saved) return res.status(500).send({mensaje:"Error al Guardar el Habitacion"})

  
                    var suma= Number(HotelExiste[0].Habitaciones) + 1
                    console.log(suma)

                    Hoteles.update({_id: ModeloHabitacion.NombreHotel},{Habitaciones: suma}).exec(()=>{
                        if(err) return res.status(500).send({mensaje: "Error"})
                        return res.status(200).send({Saved})
                    })

                 
                })  

            })

        })

    

    }else{
        return res.status(500).send({mensaje:"No se enviaron los parametos"})
    }
 

}


function obtenerHabitacionID(req, res) {
    var id = req.params.id

    Habitacion.findById(id,(err, Habitaciones)=>{
        if(err) return res.status(500).send({mensaje: "Error"})
        if(!Habitaciones) return res.status(500).send({mensaje:"Error al buscar"})
        return res.status(200).send({Habitaciones})
    })
    
}


//mostrar habitacion hotel

function obtenerHabitaciones(req, res) {

    var NombreHotel = req.params.nombre
    var fechaActual = new Date()

    console.log(NombreHotel)
    if(NombreHotel === null) return res.status(500).send({mensaje: ""})


    Habitacion.find({NombreHotel: NombreHotel}, (err, Habitaciones)=>{
        if(err) return res.status(500).send({mensaje: "Error"})
        if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})

        Reservacion.find({ Hotel : NombreHotel},(err, ReservacionExistentes)=>{
            if(err) return res.status(500).send({mensaje: "Error"})
            if(!ReservacionExistentes || ReservacionExistentes.length > 0){


            if(Habitaciones.length > 0){
            for(var i=0 ; i < Habitaciones.length; i++){

                console.log(Habitaciones.length)

                for(var e=0 ; e < ReservacionExistentes.length; e++){
                console.log(ReservacionExistentes[e].Habitacion)
                console.log(Habitaciones[i]._id)
                    var Reservacion =String(ReservacionExistentes[e].Habitacion) 
                    var Habitacions = String(Habitaciones[i]._id)

                    if(Reservacion === Habitacions) {

                        console.log(ReservacionExistentes[e].Habitacion)

                       var Fecha = new Date(ReservacionExistentes[e].FechaEnd)
                        var FechaI = new Date(ReservacionExistentes[e].FechaInit)
                        var FechaActual = new Date()
                        if(Fecha.getTime() < FechaActual.getTime()){
                            console.log(ReservacionExistentes[e].FechaEnd)
                            console.log(fechaActual.getTime())

                            Habitacion.update({_id: ReservacionExistentes[e].Habitacion, NombreHotel:NombreHotel},{Disponible: true, FechaEnd: "Ahora", FechaInit : "Ahora"},(err, updateHabitacion)=>{
                                if(err) return res.status(500).send({mensaje:"Error al actualizar habitacion"})
                                if(!updateHabitacion) return res.status(500).send({mensaje:"Error al actualizar el estado de la habitacion"})
                            })
                        }
                            console.log(FechaI.getTime())
                            console.log(fechaActual.getTime())

                            if( FechaI.getTime() < fechaActual.getTime()){

                                console.log(ReservacionExistentes[e].FechaEnd)
    
                                Habitacion.update({_id: ReservacionExistentes[e].Habitacion, NombreHotel:NombreHotel},{Disponible: false, FechaEnd: ReservacionExistentes[e].FechaEnd},(err, updateHabitacion)=>{
                                    if(err) return res.status(500).send({mensaje:"Error al actualizar habitacion"})
                                    if(!updateHabitacion) return res.status(500).send({mensaje:"Error al actualizar el estado de la habitacion"})

                                        




                                    
                                })
                            }

                        
                    }
                
                } 
                
            }
        }

            if(req.user.rol === "ROL_DUEÑO" ){
  
                Habitacion.find({NombreHotel: NombreHotel }, (err, Habitaciones)=>{
                    if(err) return res.status(500).send({mensaje: "Error"})
                    if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})
             
    
    
                    return res.status(200).send({Habitaciones})
    
                
                
                })

            }else{
            Habitacion.find({NombreHotel: NombreHotel }, (err, Habitaciones)=>{
                if(err) return res.status(500).send({mensaje: "Error"})
                if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})
         


                return res.status(200).send({Habitaciones})

            
            
            })
        }
    }else{
        if(req.user.rol === "ROL_DUEÑO"){
  
            Habitacion.find({NombreHotel: NombreHotel }, (err, Habitaciones)=>{
                if(err) return res.status(500).send({mensaje: "Error"})
                if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})
         


                return res.status(200).send({Habitaciones})

            
            
            })

        }else{
        Habitacion.find({NombreHotel: NombreHotel, Disponible: true }, (err, Habitaciones)=>{
            if(err) return res.status(500).send({mensaje: "Error"})
            if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})
     


            return res.status(200).send({Habitaciones})

        
        
        })
    }

    }
        })
        
    })

}


//editar Habitaciones

function editarHabitaciones(req, res) {
    var id = req.params.id


    Habitacion.find({_id:id }, (err, Habitaciones)=>{
        if(err) return res.status(500).send({mensaje: "Error"})
        if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})

        Reservacion.find({Terminada: true, Habitacion : id },(err, ReservacionExistentes)=>{
            console.log(Habitaciones)

            for(var i=0 ; i < Habitaciones.length; i++){


                for(var e=0 ; e < ReservacionExistentes.length; e++){
console.log(ReservacionExistentes[e].Habitacion)
console.log(Habitaciones[i]._id)
var Reservacion =String(ReservacionExistentes[e].Habitacion) 
var Habitacions = String(Habitaciones[i]._id)

if(Reservacion === Habitacions) {

                        console.log(ReservacionExistentes[e].Habitacion)

                       var Fecha = new Date(ReservacionExistentes[e].FechaEnd)
                        var FechaI = new Date(ReservacionExistentes[e].FechaInit)
                        var FechaActual = new Date()

                        if(Fecha.getTime()> FechaActual.getTime()) return res.status(500).send({mensaje: "No se puede editar, una habitacion que tiene reservaciones sin culminar la estadia "})
                    }
                }
            }







    if(req.user.rol === "ROL_ADMIN" || req.user.rol === "ROL_CLIENTE") return res.status(500).send({mensaje:"Solo el DUEÑO puede agregar habitaciones"})
    var params = req.body
    delete params.NombreHotel;
    delete params.Disponible;
    delete params.FechaEnd;
    if(params.NombreHotel || params.Disponible) return res.status(500).send({mensaje: "No se puede modificar el hotel, ni la disponibilidad"})
    
    
    
    if(params.Nombre){


        Habitacion.find({Nombre: params.Nombre},(err, HabitacionBusqueda)=>{
            if(!HabitacionBusqueda) return res.status(500).send({mensaje:"No existe esa habitacion"})
            if(err) return res.status(500).send({mensaje: "Error"})
            if(HabitacionBusqueda.length > 0) return res.status(500).send({mensaje:"Ese nombre de habitacion ya existe"})
            
            console.log("entre")
            Habitacion.find({_id:id},(err, HabitacionBusqueda1)=>{
                if(err) return res.status(500).send({mensaje: "Error"})
                console.log(id)
                if(HabitacionBusqueda1.length === 0) return res.status(500).send({mensaje:"La habitacion ya no existe"})


                Hoteles.find({_id : HabitacionBusqueda1[0].NombreHotel, DueñoUsuario : req.user.Usuario }).exec((err, HotelExiste)=>{
                    if(err) return res.status(500).send({mensaje: "Error con el nombre hotel "})
                    console.log(HabitacionBusqueda1)
                    if(HotelExiste.length === 0) return res.status(500).send({mensaje:"Error usted no es Dueño"})
                    



                    Habitacion.findOneAndUpdate({_id: id},  params, {new:true},(err, HabitacionActualizado)=>{
                        if(err) return res.status(500).send({mensaje: "Error"})
                        if(!HabitacionActualizado) return res.status(500).send({mensaje:"Habitacion no existente"})
                        return res.status(200).send({HabitacionActualizado})
                    })
                })
            })
        })


    }else{

        Habitacion.findOneAndUpdate({Nombre: Nombres},  params, {new:true},(err, HabitacionActualizado)=>{
            if(err) return res.status(500).send({mensaje: "Error"})
            if(!HabitacionActualizado) return res.status(500).send({mensaje:"ERROR al actualizarse"})
            return res.status(200).send({HabitacionActualizado})
        })

        
    }
  } )
})

}



//eliminar

function eliminarHabitacion(req, res){
    var id = req.params.id
    if(req.user.rol != "ROL_DUEÑO") return res.status(500).send({mensaje: "Solo el admin puede eliminar habitacions"})
    Habitacion.find({_id:id }, (err, Habitaciones)=>{
        if(err) return res.status(500).send({mensaje: "Error"})
        if(!Habitaciones) return res.status(500).send({mensaje: "Error al buscar habitaciones o no tiene"})

        Reservacion.find({Terminada: true, Habitacion : id },(err, ReservacionExistentes)=>{
            console.log(ReservacionExistentes)

            for(var i=0 ; i < Habitaciones.length; i++){


                for(var e=0 ; e < ReservacionExistentes.length; e++){
                console.log(ReservacionExistentes[e].Habitacion)
                console.log(Habitaciones[i]._id)
                var Reservacion =String(ReservacionExistentes[e].Habitacion) 
                var Habitacions = String(Habitaciones[i]._id)

                if(Reservacion === Habitacions) {

                        console.log(ReservacionExistentes[e].Habitacion)


                       var Fecha = new Date(ReservacionExistentes[e].FechaEnd)
                        var FechaI = new Date(ReservacionExistentes[e].FechaInit)
                        var FechaActual = new Date()

                        if(Fecha.getTime()> FechaActual.getTime()) return res.status(500).send({mensaje: "No se puede Eliminar una habitacion que tiene reservaciones sin culminar la estadia "})
                    }
                }
            }




    Habitacion.find({_id: id}).exec((err, HabitacionE)=>{
        if(err) return res.status(500).send({mensaje:"error"})
        if(!HabitacionE  || HabitacionE.length === 0) return res.status(500).send({mensaje: "Error al eliminar habitacion o Esta asígnada a una reservacion"})
        
        Hoteles.find({_id: HabitacionE[0].NombreHotel, DueñoUsuario: req.user.Usuario}, (err, HotelExistente)=>{
            if(err) return res.status(500).send({mensaje: "Error"})
            if(!HotelExistente || HotelExistente.length === 0) return res.status(500).send({mensaje: "Error o usted no es el dueño"})


            Habitacion.findOneAndDelete({_id: id} ,(err, Eliminado)=>{
            if(err) return res.status(500).send({mensaje: "Error"})
            if(!Eliminado) return res.status(500).send({mensaje: "Error"})

            var suma= Number(HotelExistente[0].Habitaciones) - 1
                    console.log(suma)

                    Hoteles.update({Nombre: HabitacionE[0].NombreHotel},{Habitaciones: suma}).exec((err, Noactualizado)=>{
                        if(err) return res.status(500).send({mensaje: "Error"})
                        if(!Noactualizado) return res.status(500).send({mensaje: "Error"})
                        return res.status(200).send({Eliminado})
                    })

                })

        })



    })

})
    })
}


//Buscar Usuario

function buscarUsuarioHospedado(req, res) {
    var params = req.body;
    var fechaActual = new Date()
    var fechaFinal 
    var Usuarios = []
    var Lugar = 0

Hoteles.find({DueñoUsuario: req.user.Usuario},(err, HotelExiste)=>{
    if(err) return res.status(500).send({mensaje: "Error"})
    if(!HotelExiste || HotelExiste.length === 0) return res.status(500).send({mensaje: "Erro al buscar el hotel o el usuario aun no tiene uno asignado"})
    Reservacion.find({Hotel: HotelExiste[0]._id, Terminada: true },(err, Reservaciones)=>{
        if(err) return res.status(500).send({mensaje: "Error"})
        if(!Reservaciones || Reservaciones.length === 0) return res.status(500).send({mensaje: "Error al buscar, o no hay datos"})

        Reservacion.populate(Reservaciones,{ path:"Usuario"},(err, Reservaciones)=>{
            if (err) return res.status(500).send({mensaje:"Error"})
            if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})



            Reservacion.populate(Reservaciones,{ path:"Habitacion"},(err, Reservaciones)=>{
                if (err) return res.status(500).send({mensaje:"Error"})
                if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
    
            

        for(var i=0; i<  Reservaciones.length; i++){
             fechaFinal = new Date(Reservaciones[i].FechaEnd)
             var fechaIniciar = new Date(Reservaciones[i].FechaInit)

             console.log(Reservaciones[i].FechaInit)

            if(fechaActual.getTime() < fechaFinal.getTime() && fechaActual.getTime() > fechaIniciar.getTime() ){

                Usuarios[Lugar] = {
                                  Usuario: Reservaciones[i].Usuario,
                                  Habitacion : Reservaciones[i].Habitacion,
                                  Entrada: fechaIniciar,
                                  Salida: fechaFinal

                                    
                }
                Lugar++  
                console.log(Lugar)


            }




        }
        return res.status(200).send({Usuarios})

    })    
})    

    })
})
    
}


module.exports= {agregarHabitacion, obtenerHabitaciones, editarHabitaciones,eliminarHabitacion,buscarUsuarioHospedado,obtenerHabitacionID}