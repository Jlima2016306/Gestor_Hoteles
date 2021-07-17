"use strict"

var Evento = require("../modelos/evento.modelo");
var Hoteles = require("../modelos/hoteles.modelo")

//Crear evento
function agregarEvento(req, res){
    var ModeloEvento = new Evento()
    var params = req.body;



    if(req.user.rol === "ROL_ADMIN" || req.user.rol === "ROL_CLIENTE") return res.status(500).send({mensaje:"Solo el DUEÑO puede agregar habitaciones"})

    if(params.Nombre && params.Descripcion && params.FechaInit && params.FechaEnd  && params.Tipo){
        
        ModeloEvento.Nombre = params.Nombre;
        ModeloEvento.Descripcion = params.Descripcion;

        

        ModeloEvento.FechaInit = params.FechaInit.year+ "-" + params.FechaInit.month + "-" + params.FechaInit.day;
        ModeloEvento.FechaEnd = params.FechaEnd.year +"-"+ params.FechaEnd.month + "-" + params.FechaEnd.day;

        var Final = new Date(ModeloEvento.FechaEnd);
        var Inicio = new Date(ModeloEvento.FechaInit)
        var actual = new Date()
        console.log(Inicio)
        console.log(Final)
        console.log(actual)

        
        if(Final.getTime() < Inicio.getTime()){// gettime convierte la fecha en un numero, por lo cual se pueden comparar

            return res.status(500).send({mensaje:"La fecha de inicio debe estar antes que el día final"})

        }

        if(Inicio.getTime() < actual.getTime()){// gettime convierte la fecha en un numero, por lo cual se pueden comparar

           return res.status(500).send({mensaje:"No puedes crear un evento para el pasado"})

        }




        ModeloEvento.Tipo = params.Tipo; 

    Hoteles.find({DueñoUsuario: req.user.Usuario}).exec((err, ExisteHotel)=>{
    if(err) return res.status(500).send({mensaje:"Error"})
        if(!ExisteHotel || ExisteHotel.length == 0) return res.status(500).send({mensaje:"No existe ese hotel"})
    ModeloEvento.NombreHotel = ExisteHotel[0]._id;
        console.log(ExisteHotel[0]._id)

        Evento.find({Nombre : ModeloEvento.Nombre, NombreHotel: ExisteHotel[0]._id }).exec((err, EventoExiste)=>{
            if(err) return res.status(500).send({mensaje:"Hay Error al ingresar el evento"})
            if(EventoExiste.length > 0) return res.status(500).send({mensaje:"Ya hay un evento con ese nombre"})


                ModeloEvento.save((err, Saved)=>{
                    if(err) return res.status(500).send({mensaje:"Error al guardar"})
                    if(!Saved) return res.status(500).send({mensaje:"Error al Guardar el evento"})

                    return res.status(200).send({Saved})

                })
            })
        
    });   
    }else{
        return res.status(200).send({mensaje:"No se enviaron los parametos, los cuales para enviarse deben ser: Nombre, Descripcion, Fecha de inicio, fecha de finalizacion y el nombre del hotel"})
    }
}

//Ver evento por Hotel

function obtenerEvento(req,res) {
    var Nombre = req.params.nombre;


    Hoteles.findOne({Nombre: Nombre},(err, Hotel)=>{
    if(err) return res.status(500).send({mensaje:"Error"})
    if(!Hotel || Hotel.length == 0) return res.status(500).send({mensaje:"No se encontro el hotel, o envio un dato malo"})
        console.log(Hotel._id)
    Evento.find({NombreHotel: Hotel._id}, (err, EventosHotel) => {
        if(err) return res.status(500).send({mensaje:"Error"})
        if(!EventosHotel) return res.status(500).send({mensaje:"No se encontraron Eventos o hubo un error"})
        if(EventosHotel.length === 0) return res.status(500).send({mensaje:"No se encontraron Eventos "})

        return res.status(200).send({EventosHotel})
    
})

})
}

// oBTENER Evento POR ID, solo funciona en angular. Por que allí ya se valido que el usuario sea DUEÑO, NO USAR EN POSTMAN

function obtenerEventoId(req, res) {
    var id = req.params.id

    Evento.findById(id, (err, EventoObtenido)=>{
        if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
        if(!EventoObtenido || EventoObtenido.length == 0) return res.status(500).send({mensaje:"No existe ese evento o ya fue eliminado, recargue la pagina"})
        return res.status(200).send({EventoObtenido})
    })

}


// eDITAR Evento, solo funciona en angular. Por que allí ya se valido que el usuario sea DUEÑO, NO USAR EN POSTMAN

function editarEvento(req, res) {
    var id = req.params.id
    var params = req.body
    delete params.NombreHotel
    console.log(params)

Hoteles.findOne({DueñoUsuario : req.user.Usuario},(err, HotelExiste)=>{
    if(err) return res.status(500).send({mensaje:"Error"})
    if(!HotelExiste || HotelExiste.length == 0) return res.status(500).send({mensaje:"No se encontro el hotel"})


    Evento.findById(id,(err, Eventos) => {
    if(err) return res.status(500).send({mensaje:"Error"})

    if(Eventos.Nombre != params.Nombre){
        Evento.find({Nombre: params.Nombre, NombreHotel: HotelExiste._id}, (err, EventosEvento) => {
            if(err) return res.status(500).send({mensaje:"Error"})
            if(!EventosEvento || EventosEvento.length > 0) return res.status(500).send({mensaje:"Error o el Nombre de evento ya existe"})

            Evento.findByIdAndUpdate(id, params,{new: true},(err ,EventoEditado)=>{
                if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
                if(!EventoEditado) return res.status(500).send({mensaje:"No existe ese evento o ya fue eliminado, recargue la pagina"})
                return res.status(200).send({EventoEditado})
        
            })


        })


    }else{
        Evento.findByIdAndUpdate(id, params,{new: true},(err,EventoEditado)=>{
            if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
            if(!EventoEditado) return res.status(500).send({mensaje:"No existe ese evento o ya fue eliminado, recargue la pagina"})
            return res.status(200).send({EventoEditado})
    
        })

    }
 




})

})
    

}



// Eliminar Evento, solo funciona en angular. Por que allí ya se valido que el usuario sea DUEÑO, NO USAR EN POSTMAN


function EliminarEvento(req, res) {
    var id = req.params.id

    Evento.findByIdAndDelete(id,(err,EventoObtenido)=>{
        if(err) return res.status(500).send({mensaje:"Error al buscar evento"})
        if(!EventoObtenido) return res.status(500).send({mensaje:"No existe ese evento o ya fue eliminado, recargue la pagina"})
        return res.status(200).send({EventoObtenido})

    })
    

}


//Exportar Evento

module.exports = {agregarEvento,obtenerEvento , obtenerEventoId,editarEvento, EliminarEvento}