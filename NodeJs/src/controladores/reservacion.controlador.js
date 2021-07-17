"use strict"
var Reservacion = require("../modelos/Reservacion.modelo")
var Usuario = require("../modelos/usuario.model")
var Habitacion = require("../modelos/habitacion.modelo")
var hotel = require("../modelos/hoteles.modelo")
var dateFormat = require("dateformat");
var Carrito = require("../modelos/carritoServicios.modelo")
//ReservacionExiste
//
//Agregar 

function agregarReservacion(req,res) {
var params = req.body
var modeloReservacion = new Reservacion()


if(req.user.rol != "ROL_CLIENTE") return res.status(500).send({mensaje:"Debe ser Cliente o No se ha registrado, para poder hacer una reservacion"})
console.log(params)
if(params.FechaInit && params.FechaEnd && params.Habitacion && params.Hotel){
//hoteles
    modeloReservacion.fechaReservacion = new Date()
    modeloReservacion.Usuario = req.user.sub;

    modeloReservacion.FechaInit = params.FechaInit.year+ "-" + params.FechaInit.month + "-" + params.FechaInit.day;
    modeloReservacion.FechaEnd = params.FechaEnd.year +"-"+ params.FechaEnd.month + "-" + params.FechaEnd.day;



    modeloReservacion.Hotel = params.Hotel  
    modeloReservacion.Terminada = false  

Reservacion.find({Usuario: req.user.sub, Hotel: params.Hotel, Terminada: false },(err, ValidadicionReservacion)=>{
    if(err) return res.status(500).send({mensaje:"Error al validar reservacion"})
    if(!ValidadicionReservacion || ValidadicionReservacion.length > 0) return res.status(500).send({mensaje:"Aun hay una reservacion de este hotel, de este usuario sin facturar"})
    hotel.find({_id: params.Hotel} ,(err, HotelExiste)=>{
        if(err) return res.status(500).send({mensaje:"Error al buscar la Hotel"})
        if(!HotelExiste) return res.status(500).send({mensaje:"Error al encontrar la Hotel"})
        if(HotelExiste.length == 0) return res.status(200).send({mensaje:"No se encontro la Hotel"})

        console.log(modeloReservacion)

        Habitacion.find({_id: params.Habitacion,  Disponible: "true", NombreHotel: params.Hotel} ,(err, HabitacionExiste)=>{
            if(err) return res.status(500).send({mensaje:"Error al buscar la habitacion"})
            if(!HabitacionExiste) return res.status(500).send({mensaje:"Error al encontrar la habitacion"})
            if(HabitacionExiste.length == 0) return res.status(200).send({mensaje:"No se encontro la habitacion, o no esta disponible"})

            Reservacion.find({Terminada: true, Hotel : params.Hotel},(err, ReservacionExistentes)=>{
                for(var i=0 ; i < ReservacionExistentes.length; i++){
    


                        if(ReservacionExistentes[i].Habitacion == params.Habitacion) {
                            var Inicio= new Date(modeloReservacion.FechaInit);
                            var Final= new Date(modeloReservacion.FechaEnd); 


                           var FechaHabFinal = new Date(ReservacionExistentes[i].FechaEnd)
                            var FechaHabInicio = new Date(ReservacionExistentes[i].FechaInit)

                            console.log(dateFormat(FechaHabInicio,'yyyy-mm-d'))
                            var FechitaBonitaInicio =  dateFormat(FechaHabInicio,'yyyy-mm-d')// (FechaHabInicio).getUTCFullYear() + "-" + FechaHabInicio.getUTCMonth() + "-" + FechaHabInicio.getUTCDay()
                            var FechitaBonitaFinal =  dateFormat(FechaHabFinal,'yyyy-mm-d')// FechaHabFinal.getUTCFullYear() + "-" + FechaHabFinal.getUTCDate() + "-" + FechaHabFinal.getDay()
                            console.log(FechaHabFinal)
                            console.log(FechaHabInicio)
            
                            if((Inicio.getTime() >= FechaHabInicio.getTime()) && (Inicio.getTime() <= FechaHabFinal.getTime())) return res.status(500).send({mensaje:"Error la habitacion estara en uso en este periodo: de "+ FechitaBonitaInicio+ " hasta " + FechitaBonitaFinal})
                            if((Final.getTime() >= FechaHabInicio.getTime()) && (Final.getTime() <= FechaHabFinal.getTime())) return res.status(500).send({mensaje:"Error la habitacion estara en uso en este periodo de "+ FechitaBonitaInicio+ " hasta " + FechitaBonitaFinal})
                            if((Inicio.getTime() <= FechaHabInicio.getTime()) && (Final.getTime() >=  FechaHabFinal.getTime())) return res.status(500).send({mensaje:"Error la habitacion estara en uso en este periodo de "+ FechitaBonitaInicio+ " hasta " + FechitaBonitaFinal})



                        }
                    
                    
                    
                }


            


            modeloReservacion.Habitacion = params.Habitacion
            var Inicio= new Date(modeloReservacion.FechaInit);
            var Final= new Date(modeloReservacion.FechaEnd); 
            var actual = new Date()
            console.log(HabitacionExiste[0].FechaEnd )
            if(HabitacionExiste[0].FechaEnd != "Ahora"){
                var FechaHabFinal = new Date(HabitacionExiste[0].FechaEnd)
                var FechaHabInicio = new Date(HabitacionExiste[0].FechaInit)
                console.log(FechaHabFinal)
                console.log(FechaHabInicio)
                if((Inicio.getTime() >= FechaHabInicio.getTime()) && (Inicio.getTime() <= FechaHabFinal.getTime())) return res.status(500).send({mensaje:"Error la habitacion estara en uso en ese periodo"})
                if((Final.getTime() >= FechaHabInicio.getTime()) && (Final.getTime() <= FechaHabFinal.getTime())) return res.status(500).send({mensaje:"Error la habitacion estara en uso en ese periodo"})
                if((Inicio.getTime() <= FechaHabInicio.getTime()) && (Final.getTime() >=  FechaHabFinal.getTime())) return res.status(500).send({mensaje:"Error la habitacion estara en uso en ese periodo"})

            }




            if(Final.getTime() < Inicio.getTime()){// gettime convierte la fecha en un numero, por lo cual se pueden comparar

                return res.status(200).send({mensaje:"La fecha de inicio debe estar antes que el día final"})

            }

            if(Inicio.getTime() < actual.getTime()){// gettime convierte la fecha en un numero, por lo cual se pueden comparar

               return res.status(200).send({mensaje:"No puedes reservar para el pasado"})

            }




            var diff = Final.getTime() - Inicio.getTime();
            var Dias = Math.round(diff / (1000 * 60 * 60 * 24))
            
        
            if(Dias == 0){// gettime convierte la fecha en un numero, por lo cual se pueden comparar

                return res.status(200).send({mensaje:"No tenemos tarifas para menos de un día"})

            }

    

            modeloReservacion.PrecioReservacion = Number(HabitacionExiste[0].PrecioNoche)* Number(Dias)
  
                modeloReservacion.Dias = Number(Dias)
                modeloReservacion.save((err, ReservacionHecha)=>{

                    if(err) return res.status(500).send({mensaje:"Error al guadar la reservacion"})
                    if(!ReservacionHecha) return res.status(500).send({mensaje:"No se pudo Guardar"})


                    Habitacion.update({_id: params.Habitacion, NombreHotel: params.Hotel},{},(err, updateHabitacion)=>{
                    if(err) return res.status(500).send({mensaje:"Error error al actualizar Habitacion"})
                    if(!updateHabitacion) return res.status(500).send({mensaje:"Error al actualizar el estado de la habitacion"})

                    var suma= Number(HotelExiste[0].Reservaciones) + 1
                    console.log(suma)

                    hotel.update({_id: params.Hotel},{Reservaciones: suma}).exec(()=>{
                        if(err) return res.status(500).send({mensaje: "Error al actualizar hotel"})
                        return res.status(200).send({ReservacionHecha})
                        
                    })

                    })

                

            })


        })
        })
    })
})
}else{
    return res.status(500).send({mensaje:"No se han completado los datos para hacer la reservacion"})
}


}





//VerUsuario

function obtenerReservacion(req,res) {
    console.log(req.user.rol)
    if (req.user.rol==="ROL_CLIENTE"){

        Reservacion.find({Usuario: req.user.sub},(err, Reservaciones)=>{
            if (err) return res.status(500).send({mensaje:"Error"})
            if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})

            Reservacion.populate(Reservaciones,{ path:"Hotel"},(err, Reservaciones)=>{
                if (err) return res.status(500).send({mensaje:"Error"})
                if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
    

                Reservacion.populate(Reservaciones,{ path:"Habitacion"},(err, Reservaciones)=>{
                    if (err) return res.status(500).send({mensaje:"Error"})
                    if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
        
                            Reservacion.populate(Reservaciones,{ path:"Usuario"},(err, Reservaciones)=>{
                                if (err) return res.status(500).send({mensaje:"Error"})
                                if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
                    
                
                             return res.status(200).send({Reservaciones})
                
                
                                
                            })    
                    
                })

                
            })
        })

    }else{

            if (req.user.rol==="ROL_DUEÑO") {


                    hotel.find({DueñoUsuario: req.user.Usuario},(err,Hoteles)=>{
                    if (err) return res.status(500).send({mensaje:"Error"})
                    if(!Hoteles || Hoteles.length === 0) return res.status(500).send({mensaje:"Error al buscar el hotel"})
                    

                    Reservacion.find({Hotel: Hoteles[0]._id },(err, Reservaciones)=>{
                        if (err) return res.status(500).send({mensaje:"Error"})
                       if (!Reservaciones || Reservaciones.length === 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})

                       Reservacion.populate(Reservaciones,{ path:"Hotel"},(err, Reservaciones)=>{
                        if (err) return res.status(500).send({mensaje:"Error"})
                        if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
            
        
                        Reservacion.populate(Reservaciones,{ path:"Habitacion"},(err, Reservaciones)=>{
                            if (err) return res.status(500).send({mensaje:"Error"})
                            if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
                
            
                            Reservacion.populate(Reservaciones,{ path:"Usuario"},(err, Reservaciones)=>{
                                if (err) return res.status(500).send({mensaje:"Error"})
                                if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
                    
                
                             return res.status(200).send({Reservaciones})
                
                
                                
                            })            
            
                            
                        })
                       
                     } )


                    })
                })
            
            }else{

                if (req.user.rol==="ROL_ADMIN"){

                    Reservacion.find({},(err, Reservaciones)=>{
                        if (err) return res.status(500).send({mensaje:"Error"})
                        if (!Reservacion || Reservacion.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})

                        Reservacion.populate(Reservaciones,{ path:"Hotel"},(err, Reservaciones)=>{
                            if (err) return res.status(500).send({mensaje:"Error"})
                            if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
                
            
                            Reservacion.populate(Reservaciones,{ path:"Habitacion"},(err, Reservaciones)=>{
                                if (err) return res.status(500).send({mensaje:"Error"})
                                if (!Reservaciones || Reservaciones.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
                    
                
                                return res.status(200).send({Reservaciones})
                
                
                                
                            })
                           
                         } )
                    })
            
                
                }else{
                    return res.status(200).send({mensaje:"No tiene un rol Valido"})
                
                }
            }

        }
}

//----------------------------------------------------------------

function obtenerReservacionActiva(req, res){

Reservacion.findOne({Usuario : req.user.sub, Terminada: false },(err, SinFacturar)=>{
    if(err) return res.status(500).send({mensaje:"Error al buscar"})
    if(!SinFacturar) return res.status(500).send({mensaje:"No hay Sin facturar"})

            Reservacion.populate(SinFacturar,{path:"Habitacion"}, (err, SinFacturar)=>{
                if(err) return res.status(500).send({mensaje:"Error al buscar"})
                if(!SinFacturar) return res.status(500).send({mensaje:"No hay Sin facturar"})
            
                Reservacion.populate(SinFacturar,{path:"Hotel"}, (err, SinFacturar)=>{
                    if(err) return res.status(500).send({mensaje:"Error al buscar"})
                    if(!SinFacturar) return res.status(500).send({mensaje:"No hay Sin facturar"})
                
                    return res.status(200).send({SinFacturar})

                })

            })



})

}
    

function obtenerMesesBloqueados(req, res) {
    var id = req.params.id
    var params  = req.body

    var Fechas = []
    var LugarDeArreglo=0;

    
    console.log(id)

    Reservacion.find({ Hotel : id},(err, ReservacionExistentes)=>{
        if(err) return res.status(500).send({mensaje:"Error"})
        if(!ReservacionExistentes) return res.status(500).send({mensaje:"Error"})

        for(var i=0 ; i < ReservacionExistentes.length; i++){

            console.log(ReservacionExistentes.length)
            console.log(params.Habitacion)

                if(ReservacionExistentes[i].Habitacion == params.Habitacion) {
                   var FechaHabFinal = new Date(ReservacionExistentes[i].FechaEnd)
                    var FechaHabInicio = new Date(ReservacionExistentes[i].FechaInit)

                    console.log(dateFormat(FechaHabInicio,'yyyy-mm-d'))
                    var FechitaBonitaInicio =  dateFormat(FechaHabInicio,'yyyy-mm-d')// (FechaHabInicio).getUTCFullYear() + "-" + FechaHabInicio.getUTCMonth() + "-" + FechaHabInicio.getUTCDay()
                    var FechitaBonitaFinal =  dateFormat(FechaHabFinal,'yyyy-mm-d')// FechaHabFinal.getUTCFullYear() + "-" + FechaHabFinal.getUTCDate() + "-" + FechaHabFinal.getDay()

    
                    Fechas[LugarDeArreglo]= {
                                                FechaInicio : FechitaBonitaInicio,
                                                FechaFinal :FechitaBonitaFinal
                                                }

                    LugarDeArreglo++;


                }            
            
            
        }

        return res.status(200).send({Fechas})


    })
    
}

function mostrarHistorialHoteles(req, res){

    Reservacion.find({Usuario: req.user.sub, Terminada: true},(err, HistorialDeHotel)=>{
        Reservacion.populate(HistorialDeHotel,{path:"Hotel"},(err, HistorialDeHotel)=>{

        if(err) return res.status(500).send({mensaje:"Error al obtener el historial"})
        var Historial = []
        var suma= 0
        var Hotel= 0

        if(!HistorialDeHotel || HistorialDeHotel.length === 0) return res.status(500).send({mensaje:"No hay servicios para mostrar"})
        for(var e=0 ; e < HistorialDeHotel.length; e++){
     


            console.log(dateFormat(HistorialDeHotel[e].fechaReservacio,'yyyy-mm-d') )
            
            var Fecha = String(dateFormat(HistorialDeHotel[e].fechaReservacio,'yyyy-mm-d')) 
            HistorialDeHotel[e].Hotel.__v = Fecha
            Historial[suma]=  HistorialDeHotel[e]

            suma =   suma + 1

            

        }

        return res.status(200).send({Historial})
    })
    })
}





//VerHotel

//CancelarReservacion()


function EliminarReservacion(req, res){
    var id = req.params.id     
//    console.log(req.user.sub)

    Reservacion.findOne({_id: id, Usuario: req.user.sub}, (err, UsuarioEnReservacionCorrecta)=>{
        if(err) return res.status(500).send({mensaje:"Error al elimina9r la reservacion"})
        console.log(UsuarioEnReservacionCorrecta)

        if(!UsuarioEnReservacionCorrecta || UsuarioEnReservacionCorrecta.length == 0) return res.status(500).send({mensaje:"Usted no es poseedor de esta reservacion como para eliminarla"})

        Reservacion.findOneAndDelete({_id:id},(err, Eliminado)=>{
            if(err) return res.status(500).send({mensaje:"Error al eliminar Reservacion"})
            if(!Eliminado || Eliminado.length === 0) return res.status(500).send({mensaje:"No se pudo eliminar o Ya se elimino"})

            Habitacion.update({_id: UsuarioEnReservacionCorrecta.Habitacion},{Disponible: true, FechaInit: "Ahora", FechaEnd: "Ahora"},(err, updateHabitacion)=>{
                if(err) return res.status(500).send({mensaje:"Error al actualizar habitacion"})
                if(!updateHabitacion) return res.status(500).send({mensaje:"Error al actualizar el estado de la habitacion"})
            
            hotel.find({_id: UsuarioEnReservacionCorrecta.Hotel},(err, HotelExiste)=>{
                    var suma= Number(HotelExiste[0].Reservaciones) - 1
                    console.log(suma)

                    hotel.update({_id: UsuarioEnReservacionCorrecta.Hotel},{Reservaciones: suma}).exec(()=>{
                        if(err) return res.status(500).send({mensaje: "Error"})

                        Carrito.findOneAndDelete({CarritoFacturado:false, Hotel:UsuarioEnReservacionCorrecta.Hotel },(err)=>{
                            
                            if(err) return res.status(500).send({mensaje: "Error"})
                            return res.status(200).send({Eliminado})
        
                        })

                    })
                })
            })

        })

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    })

    


}




module.exports ={ agregarReservacion,obtenerReservacion,EliminarReservacion, obtenerReservacionActiva, obtenerMesesBloqueados, mostrarHistorialHoteles
}