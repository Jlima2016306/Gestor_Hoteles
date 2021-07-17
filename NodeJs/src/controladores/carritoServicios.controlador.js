"use strict"
var carritoServicios = require("../modelos/carritoServicios.modelo")
var Servicios = require("../modelos/servicio.modelo")
var reservacion = require("../modelos/Reservacion.modelo")
//agregar a carrito 

function agregarCarritoServicios(req, res){
var ModeloCarrito = new carritoServicios()
var params = req.body
if(req.user.rol !== "ROL_CLIENTE") return res.status(500).send({mensaje:"Solo el cliente puede decidir que compra"})


console.log(params)



if(params.Nombre && params.Hotel){
    
reservacion.find({Usuario: req.user.sub, Terminada: false, Hotel: params.Hotel},(err, ReservacionExiste)=>{
    if(err) return res.status(500).send({mensaje:"Error al verificar Reservacion"})
    if(!ReservacionExiste || ReservacionExiste.length === 0) return res.status(500).send({mensaje:"Error al buscar la Reservacion o aun No tiene una Sin facturar"})

    
    carritoServicios.find({Hotel: params.Hotel,
                           CarritoFacturado: false,
                           Usuario: req.user.sub
                         },(err, Carrito)=>{

        if(err) return res.status(500).send({mensaje:"error al buscar su carrito, oh NO! Su servicio no se ha ingresado"})
        if(!Carrito) return res.status(500).send({mensaje:"Error al buscar el carro"})
        if(Carrito.length > 0){

            Servicios.find({Nombre: params.Nombre, Hotel: params.Hotel},(err, ServicioExiste)=>{
                if(err) return res.status(500).send({mensaje:"Error"})
                if(!ServicioExiste  ||  ServicioExiste.length === 0) return res.status(500).send({mensaje:"No existe ese servicio, en este hotel"})


                carritoServicios.find({_id: Carrito[0]._id, "Carrito.Nombre": ServicioExiste[0].Nombre},(err, ServicioYaIngresado)=>{
                        if(err) return res.status(500).send({mensaje:"Erro al Validar el servicio"})
                        if(!ServicioYaIngresado) return res.status(500).send({mensaje:"Error al intentar validar el servicio"})
                        if(ServicioYaIngresado.length > 0) return res.status(500).send({mensaje:"Servicio ya ingresado"})
                        console.log(Carrito[0]._id)
                        console.log(ServicioYaIngresado.length)

                    var Suma= Carrito[0].PrecioServicios + ServicioExiste[0].Precio

                    console.log(ServicioExiste[0])
                    carritoServicios.findOneAndUpdate({Hotel: params.Hotel,
                                                        CarritoFacturado: false,
                                                        Usuario: req.user.sub
                                                    },
                                                    
                                                    
                                                    {$push:{Carrito:{
                                                    Nombre: ServicioExiste[0].Nombre,
                                                    Descripcion: ServicioExiste[0].Descripcion,
                                                    Precio: ServicioExiste[0].Precio}},
                                                    PrecioServicios: Suma}, 
                                                    {
                                                        new: true
                                                    },
                                                    
                                                    (err, CarritoConServicio) => {
                        if (err) return res.status(500).send({mensaje:"ERROR al ingresar Servicio al carrito"})
                        if (!CarritoConServicio) return res.status(500).send({mensaje:"ERROR al ingresar Servicio al carrito o el ususario se infiltro"})
                        return res.status(200).send({CarritoConServicio})
                        

                    })

                })

            })


            


        }else{

            Servicios.find({Nombre: params.Nombre, Hotel: params.Hotel},(err, ServicioExiste)=>{
                if(err) return res.status(500).send({mensaje:"Error"})
                if(!ServicioExiste  ||  ServicioExiste.length === 0) return res.status(500).send({mensaje:"No existe ese servicio, en este hotel"})

            ModeloCarrito.Usuario = req.user.sub
            ModeloCarrito.Hotel = params.Hotel
            ModeloCarrito.CarritoFacturado = false //
                console.log(ModeloCarrito)

                ModeloCarrito.save((err, CarritoAgregado)=>{
                    if(err) return res.status(500).send({mensaje:"Error al intentar guardar"})
                    if(!CarritoAgregado) return res.status(500).send({mensaje:"Error al guardar"})

                                
                                var id = CarritoAgregado._id


                                carritoServicios.findByIdAndUpdate(id, 
                                
                                
                                {$push:{Carrito:{
                                Nombre: ServicioExiste[0].Nombre,
                                Descripcion: ServicioExiste[0].Descripcion,
                                Precio: ServicioExiste[0].Precio}},
                                PrecioServicios:ServicioExiste[0].Precio }, 

                                {
                                    new: true
                                },
                                
                                        (err, CarritoConServicio) => {

                    if (err) return res.status(500).send({mensaje:"ERROR al ingresar Servicio al carrito"})
                    if (!CarritoConServicio) return res.status(500).send({mensaje:"ERROR al ingresar Servicio al carrito"})
                    return res.status(200).send({CarritoConServicio})


            })

















                    })
                

            
            })

        }                 
    

    })
})




}else{
    return res.status(500).send({ message:"No envio los parametros"})
}



}


function carritoEnProceso(req, res){
    var id = req.params.id;

    carritoServicios.find({Hotel: id, Usuario: req.user.sub, CarritoFacturado: "false"},(err, Carrito)=>{
        if(err) return res.status(500).send({mensaje:"Error al mostrar carrito"})
        if(!Carrito) return res.status(500).send({mensaje:"Error al buscar el carrito o Ya no existe"})
        if(Carrito.length == 0) return res.status(200).send({mensaje:"carrito vacio"})



        return res.status(200).send({Carrito})
    })
}



function mostrarHistorialServicios(req, res){

    carritoServicios.find({Usuario: req.user.sub, CarritoFacturado: true},{Carrito: 1, _id: 2},(err, HistorialDeServicios)=>{
        if(err) return res.status(500).send({mensaje:"Error al obtener el historial"})
        var Historial = []
        var suma= 0
        if(!HistorialDeServicios || HistorialDeServicios.length === 0) return res.status(500).send({mensaje:"No hay servicios para mostrar"})
        for(var e=0 ; e < HistorialDeServicios.length; e++){
            

                for(var i=0 ; i < HistorialDeServicios[e].Carrito.length; i++){
  
                        console.log(suma)
                    Historial[suma] = HistorialDeServicios[e].Carrito[i]
                    suma =   suma + 1


                }
            

        }

        console.log(Historial[2])
        return res.status(200).send({Historial})

    })
}

module.exports = {agregarCarritoServicios, mostrarHistorialServicios, carritoEnProceso}