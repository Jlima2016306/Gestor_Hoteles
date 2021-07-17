"use strict"
var Servicio = require("../modelos/servicio.modelo")
var Hotel = require("../modelos/hoteles.modelo")

//agregar

function agregarServicio(req, res) {
    var ModeloServicio = new Servicio();
    var params = req.body;
    if(req.user.rol === "ROL_ADMIN" || req.user.rol === "ROL_CLIENTE") return res.status(500).send({mensaje:"Solo el DUEÑO puede agregar habitaciones"})

    if(params.Nombre && params.Descripcion && params.Precio ){
        ModeloServicio.Nombre = params.Nombre;
        ModeloServicio.Descripcion = params.Descripcion;
        ModeloServicio.Precio = params.Precio;

        Hotel.findOne({DueñoUsuario: req.user.Usuario },(err, HotelExiste)=>{
            if(err) return res.status(500).send({mensaje:"Error"})
            if(!HotelExiste || HotelExiste.length == 0) return res.status(500).send({mensaje:"No se encontro el hotel"})
            ModeloServicio.Hotel = HotelExiste._id;


            Servicio.find({Nombre: ModeloServicio.Nombre, Hotel: HotelExiste._id}).exec((err, Servicio)=>{
                if(err) return res.status(500).send({mensaje:"Error"})
                if(!Servicio) return res.status(500).send({mensaje:"Servicio error"})
                if(Servicio.length > 0) return res.status(200).send({mensaje:"Ya existe un servicio con ese nombre"})

                Hotel.find({_id : ModeloServicio.Hotel}).exec((err, Hotel) => {
                        if(err) return res.status(500).send({mensaje:"Error"})
                        if(!Hotel) return res.status(200).send({mensaje:"ERROR con el hotel"})
                        if(Hotel.length == 0) return res.status(500).send({mensaje:"No hay hoteles con ese nombre"})

                        ModeloServicio.save((err, ServicioGuardado)=>{

                            if(err) return res.status(500).send({mensaje:"Error"})
                            if(!ServicioGuardado) return res.status(500).send({mensaje:"Error al guardar servicio"})

                            return res.status(200).send({ServicioGuardado})


                        })
                })


            })
        })

    }else{
        return res.status(500).send({mensaje:"No se enviaron todos los datos"})
    }

}


//Obtener
function obtenerServicio(req,res) {
    var Nombre = req.params.nombre;
console.log(Nombre)

Hotel.findOne({_id: Nombre},(err, HotelExiste)=>{
    if(err) return res.status(500).send({mensaje:"Error al buscar hotel"})
    if(!HotelExiste || HotelExiste.length == 0) return res.status(500).send({mensaje:"No se encontro el hotel"})

    Servicio.find({Hotel: HotelExiste._id }, (err, ServicioHotel) => {
        if(err) return res.status(500).send({mensaje:"Error"})
        if(!ServicioHotel) return res.status(500).send({mensaje:"No se encontraron Servicios o hubo un error"})
        if(ServicioHotel.length === 0) return res.status(500).send({mensaje:"No se encontraron Servicios "})
        return res.status(200).send({ServicioHotel})
    })
})
}




function obtenerServicioId(req, res) {
    var id = req.params.id

    Servicio.findById(id, (err, ServicioObtenido)=>{
        if(err) return res.status(500).send({mensaje:"Error al buscar ServicioObtenido"})
        if(!ServicioObtenido || ServicioObtenido.length == 0) return res.status(500).send({mensaje:"No existe ese Servicio o ya fue eliminado, recargue la pagina"})
        return res.status(200).send({ServicioObtenido})
    })

}


// eDITAR Evento, solo funciona en angular. Por que allí ya se valido que el usuario sea DUEÑO, NO USAR EN POSTMAN

function editarServicio(req, res) {
    var id = req.params.id
    var params = req.body
    delete params.NombreHotel
    console.log(params)

Hotel.findOne({DueñoUsuario : req.user.Usuario},(err, HotelExiste)=>{
    if(err) return res.status(500).send({mensaje:"Error"})
    if(!HotelExiste || HotelExiste.length == 0) return res.status(500).send({mensaje:"No se encontro el hotel"})


    Servicio.findById(id,(err, Eventos) => {
    if(err) return res.status(500).send({mensaje:"Error"})

    if(Eventos.Nombre != params.Nombre){
        Servicio.find({Nombre: params.Nombre, Hotel: HotelExiste._id}, (err, EventosEvento) => {
            if(err) return res.status(500).send({mensaje:"Error"})
            if(!EventosEvento || EventosEvento.length > 0) return res.status(500).send({mensaje:"Error o el Nombre de evento ya existe"})

            Servicio.findByIdAndUpdate(id, params,{new: true},(err ,ServicioEditado)=>{
                if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
                if(!ServicioEditado) return res.status(500).send({mensaje:"No existe ese evento o ya fue eliminado, recargue la pagina"})
                return res.status(200).send({ServicioEditado})
        
            })


        })


    }else{
        Servicio.findByIdAndUpdate(id, params,{new: true},(err,ServicioEditado)=>{
            if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
            if(!ServicioEditado) return res.status(500).send({mensaje:"No existe ese evento o ya fue eliminado, recargue la pagina"})
            return res.status(200).send({ServicioEditado})
    
        })

    }
 




})

})
    

}



// Eliminar Evento, solo funciona en angular. Por que allí ya se valido que el usuario sea DUEÑO, NO USAR EN POSTMAN


function EliminarServicio(req, res) {
    var id = req.params.id

    Servicio.findByIdAndDelete(id,(err,ServicioObtenido)=>{
        if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
        if(!ServicioObtenido) return res.status(500).send({mensaje:"No existe ese Servicio o ya fue eliminado, recargue la pagina"})
        return res.status(200).send({ServicioObtenido})

    })
    

}


//Exportar

module.exports= {
                    agregarServicio, obtenerServicio, obtenerServicioId, editarServicio, EliminarServicio}
