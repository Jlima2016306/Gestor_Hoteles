"use strict"
const { populate } = require("../modelos/factura.modelo")
var Factura = require("../modelos/factura.modelo")
var Reservacion = require("../modelos/Reservacion.modelo")
var carritoServicios = require("../modelos/carritoServicios.modelo")
var hotel = require("../modelos/hoteles.modelo")
var habitacion = require("../modelos/habitacion.modelo")
const fs = require("fs");
const PDFDocument = require("pdfkit");
var dateFormat = require("dateformat");


//AgregarFactura



function agregarFactura(req, res){
var modeloFactura = new Factura()
var params = req.body
console.log(params)


if(params.Hotel){

    Factura.find({Usuario: req.user.sub, FacturaEditable: true, Hotel: params.Hotel },(err, FacturaSinterminar)=>{
        if(err) return res.status(500).send({mensaje:"Error"})
        if(!FacturaSinterminar || FacturaSinterminar.length > 0) return res.status(500).send({mensaje:"Error al buscar la crear Factura o aun hay Facturas por facturar"})


        Reservacion.find({Usuario: req.user.sub, Terminada: false,},(err, ReservacionExiste)=>{
            if(err) return res.status(500).send({mensaje:"Error"})
            if(!ReservacionExiste || ReservacionExiste.length == 0) return res.status(500).send({mensaje:"Error al buscar la reservacion o ya fue cancelada"})

            modeloFactura.Usuario = req.user.sub;
            modeloFactura.Hotel = params.Hotel;
            modeloFactura.idReservacion = ReservacionExiste[0]._id;
            modeloFactura.FacturaEditable = false
            
            carritoServicios.find({Hotel: params.Hotel,
                CarritoFacturado: false,
                Usuario: req.user.sub
            },(err, Carrito)=>{

                if(err) return res.status(500).send({mensaje:"error al buscar su carrito, oh NO! Su servicio no se ha ingresado"})
                if(!Carrito) return res.status(500).send({mensaje:"Error al buscar el carro"})
                
                modeloFactura.PrecioServicios = 0

                if(Carrito.length > 0) {
                    modeloFactura.Carrito = Carrito[0]._id

                    modeloFactura.PrecioServicios = Carrito[0].PrecioServicios;


                }
                

                    modeloFactura.PrecioReservacion = ReservacionExiste[0].PrecioReservacion;


                    var suma = Number(modeloFactura.PrecioServicios )+ Number(modeloFactura.PrecioReservacion)

                    modeloFactura.Total = suma






                    


                    modeloFactura.save((err, FacturaCreada)=>{
                        if(err) return res.status(500).send({mensaje:"Error al guardar factura"})

                        

                        if(!FacturaCreada) return res.status(500).send({mensaje:"Error al intentar guardar factura"})
                        
            
            

                        Factura.populate(FacturaCreada, {path:"Carrito"},(err, FacturaCreada)=>{
                            if(err) return res.status(500).send({mensaje:"Error al guardar factura"})
                            if(!FacturaCreada) return res.status(500).send({mensaje:"Error al intentar guardar factura"})   
                            Factura.populate(FacturaCreada, {path:"idReservacion"},(err, FacturaCreada)=>{
                                
                                        
                                Reservacion.findByIdAndUpdate(ReservacionExiste[0]._id, {Terminada: true}, (err, ReservacionFacturada)=>{
                                    if(err) return res.status(500).send({mensaje:"error al buscar su reservacion, oh NO! Su reservacion no se ha ingresado"})
                                    if(!ReservacionFacturada) return res.status(500).send({mensaje:"Error al buscar la reservacion"})
                                    if(Carrito.length > 0) {

                                            console.log()
                                    carritoServicios.findByIdAndUpdate(Carrito[0]._id,{CarritoFacturado: true},(err, CarritoFacturado) => {
                                        if(err) return res.status(500).send({mensaje:"error al buscar su carrito, oh NO! Su servicio no se ha ingresado"})
                                        if(!CarritoFacturado) return res.status(500).send({mensaje:"Error al buscar el carro"})
                
                                            return res.status(200).send({FacturaCreada})     

                                        })

                                    }else{
                                        return res.status(200).send({FacturaCreada})     


                                    }
                                    })






                            
                            })
                        })
                    
                        
                    })

                
                

                })

        })
    })





}else{
    return res.status(500).send({mensaje:"No se enviaron los parametros completos"})
}


}




//MostrarFacturaTerminadas
function obtenerFactura(req,res) {
    console.log(req.user.rol)
    if (req.user.rol==="ROL_CLIENTE"){

        Factura.find( {Usuario:req.user.sub} 
        ,(err, Facturas)=>{
            if (err) return res.status(500).send({mensaje:"Error"})
            if (!Facturas || Facturas.length == 0) return res.status(500).send({mensaje:"No se encontraron Facturas"})
            Factura.populate(Facturas,{path:"Hotel"},(err, Facturas)=>{
                            
                Factura.populate(Facturas,{path:"idReservacion"},(err, Facturas)=>{
        
                    Factura.populate(Facturas,{path:"Usuario"},(err, Facturas)=>{
                        return res.status(200).send({Facturas})
            
                        
                    })
                })
        })
     
        })

    }else{

            if (req.user.rol==="ROL_DUEÑO") {

                    
                    hotel.find({DueñoUsuario: req.user.Usuario},(err,Hoteles)=>{
                    if (err) return res.status(500).send({mensaje:"Error"})
                    if(!Hoteles || Hoteles.length === 0) return res.status(500).send({mensaje:"Error al buscar el hotel"})
                    

                    Factura.find({Hotel: Hoteles[0]._id },(err, Facturas)=>{
                        if (err) return res.status(500).send({mensaje:"Error"})
                       if (!Facturas || Facturas.length === 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})
                       Factura.populate(Facturas,{path:"Hotel"},(err, Facturas)=>{
                            
                        Factura.populate(Facturas,{path:"idReservacion"},(err, Facturas)=>{
                            Factura.populate(Facturas,{path:"Usuario"},(err, Facturas)=>{
                                return res.status(200).send({Facturas})
                    
                                
                            })
                        })
                    })
                    })
                })
            
            }else{

                if (req.user.rol==="ROL_ADMIN"){

                    Factura.find({},(err, Facturas)=>{
                        if (err) return res.status(500).send({mensaje:"Error"})
                        if (!Facturas || Facturas.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})

                        Factura.populate(Facturas,{path:"Hotel"},(err, Facturas)=>{

                            Factura.populate(Facturas,{path:"idReservacion"},(err, Facturas)=>{
                                Factura.populate(Facturas,{path:"Usuario"},(err, Facturas)=>{
                                    return res.status(200).send({Facturas})
                        
                                    
                                })                    
                            })
                        })
                    })
            
                
                }else{
                    return res.status(200).send({mensaje:"No tiene un rol Valido"})
                
                }
            }

        }
}




function PDF(req, res) {
    var id = req.params.id

    Factura.findById(id,(err, Facturas)=>{
        if (err) return res.status(500).send({mensaje:"Error"})
        if (!Factura || Facturas.length == 0) return res.status(500).send({mensaje:"No se encontraron Reservaciones"})

        Factura.populate(Facturas,{path:"Hotel"},(err, Facturas)=>{
                            
            Factura.populate(Facturas,{path:"idReservacion"},(err, Facturas)=>{

            Factura.populate(Facturas,{path:"Usuario"},(err, Facturas)=>{
                Factura.populate(Facturas,{path:"Carrito"},(err, Facturas)=>{


                habitacion.find({_id: Facturas.idReservacion.Habitacion }, (err, Habitacion)=>{

                    var fecha = new Date()
                    fecha = dateFormat(fecha,'yyyy-mm-d HH-MM-ss')

                    var path = "../Angular/src/assets/Factura.pdf"
                    
                    createInvoice(Habitacion,Facturas,path)
                    console.log(Habitacion)
                    return res.status(200).send({Facturas})


                })
                })

            })
                
            })
    })

    })
}


//Pdf Edits
function createInvoice(habitacion ,invoice, path) {
    let doc = new PDFDocument({ margin: 50 });
  
    generateHeader(doc);
    generateCustomerInformation(doc, habitacion, invoice);
    generateInvoiceTable(doc, invoice);
  
    doc.end();
    doc.pipe(fs.createWriteStream(path));
  }

  function generateHeader(doc) {
    doc
    .image("./images/koala.png", 50, 45, { width: 50 })

      .fillColor("#444444")
      .fontSize(20)
      .text("KOALA WORKS", 110, 57)
      .fontSize(10)
      .text("HotelesKoala", 220, 65, { align: "right" })
      .text("www.KoalaWorks.com", 200, 80, { align: "right" })
      .moveDown();
  }


  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
  }


  function generateCustomerInformation(doc,habitacion, invoice) {
    doc
      .text(` Hotel: ${invoice.Hotel.Nombre}`, 50, 200)
      .text(` Habitacion: ${habitacion[0].Nombre}`, 50, 215)
      .text(` Direccion: ${invoice.Hotel.Direccion}`, 50, 230)
  
        .text(`Usuario: ${invoice.Usuario.Usuario}`, 300, 200)
        .text(`Precio Noche: ${habitacion[0].PrecioNoche}`, 300, 215)
        .text(`Dias: ${invoice.idReservacion.Dias}`, 300, 230)


      .moveDown();
  }


  function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc
      .fontSize(10)
      .text(c1, 50, y)
      .text(c2, 150, y)
      .text(c3, 280, y, { width: 90, align: "right" })
      .text(c4, 350, y, { width: 90, align: "right" })
      .text(c5, 0, y, { align: "right" });
  }




  function generateInvoiceTable(doc, invoice) {
    let invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Servicio",
      "Descripcion ","",
      "Costo",
      "         ");

      generateHr(doc, invoiceTableTop + 20);
      doc.font("Helvetica");
  
    for (var i = 0; i < invoice.Carrito.Carrito.length; i++) {
      const item = invoice.Carrito.Carrito[i];

      console.log(item)

      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.Nombre,
        item.Descripcion,"",
        item.Precio 
      );


      generateHr(doc, position + 20);
    

    }


    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "ServiciosTotal",
    
       invoice.PrecioServicios
    );
  
    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
      doc,
      paidToDatePosition,
      "",
      "",
      "ReservacionTotal",
      
      invoice.PrecioReservacion
    );
    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      duePosition,
      "",
      "",
      "TOTAL",
    
      invoice.Total
    );
    doc.font("Helvetica");
  }
  

  function formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2);
  }
  
function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }



//Facturar  admin








//EditarFactura

module.exports = {agregarFactura,obtenerFactura,PDF}