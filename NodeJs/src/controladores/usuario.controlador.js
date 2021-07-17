"use strict"

//IMPORTACIONES
var Usuario= require("../modelos/usuario.model");
var Hoteles= require("../modelos/hoteles.modelo")
var Reservacion= require ("../modelos/Reservacion.modelo")
var Factura= require("../modelos/factura.modelo")

var bcrypt= require("bcrypt-nodejs");
var jwt = require("../servicios/jwt");



//CREACION DE USUARIO ADMIN

function UserAdmin(req, res){
     var usuarioMode1 = Usuario();   
       usuarioMode1.Usuario= "Admin"
     usuarioMode1.rol="ROL_ADMIN"


     Usuario.find({
          
          Usuario: "Admin"
         

})

     .exec((err, adminoEncontrado )=>{
          if(err) return console.log({mensaje: "error en la peticion del admin"});
          if(adminoEncontrado.length >= 1){

               return console.log( "El admin siempre  estuvo listo! ");
     
               }else{
                    bcrypt.hash("123456", null, null, (err, passwordEncriptada)=>{
                         usuarioMode1.password = passwordEncriptada;

                         usuarioMode1.save((err, usuarioguardado) => {
                              if(err) return console.log({mensaje : "Error en la peticion Usuario"});

                              if(usuarioguardado){
                                   console.log("Admin listo!" )

                              }else{
                                   console.log({mensaje:"Admin triste, no vino"})
     

                              }
                         
                         })     
                    })
                    

               }

     })

}




function registrar(req, res){

var usuarioMode1 = Usuario();
var params = req.body;

if(params.Usuario && params.password){
 
      //modelo base de datos   datos del formulario
     usuarioMode1.Usuario = params.Usuario;
     

     usuarioMode1.rol = "ROL_CLIENTE";

     Usuario.find({ Usuario: usuarioMode1.Usuario })

          
          .exec((err, usuariosEncontrados)=>{

               if(err) return res.status(500).send({mensaje: "error en la peticion de usuario"});
         
               if(usuariosEncontrados && usuariosEncontrados.length >= 1){

               return res.status(500).send({mensaje: "El usuario existe "});
     
               }else{
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                         usuarioMode1.password = passwordEncriptada;

                         usuarioMode1.save((err, usuarioguardado) => {
                              if(err) return res.status(500).send({mensaje : "Error en la peticion Usuario"});

                              if(usuarioguardado){
                                   res.status(200).send({usuarioguardado})

                              }else{
                                   res.status(404).send({mensaje:"No se a podido guardar el usuario"})
     

                              }
                         
                         })     
                    })
                    

               }
          
          })



     }else{
          return res.status(500).send({mensaje:"no envio los parametros correspondientes"})
     }
}




function obtenerUsuario(req, res){

     if(req.user.rol != "ROL_ADMIN" ){
          Usuario.find({_id: req.user.sub}).exec((err, usuarios)=>{
               if(err) res.status(500).send({mensaje:"error"})

               if(!usuarios) res.status(500).send({mensaje:"Error en la peticion"})

               return res.status(200).send({usuarios})
          })

     }else{

          Usuario.find().exec((err, usuarios)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Usuarios"});

          if(!usuarios)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
          return res.status(200).send({usuarios});
          

     })
   }

}

function obtenerUsuarioID(req,res){
     var params = req.body;
     var usuarioId = req.params.iDUsuario;


     Usuario.findById(usuarioId, (err, usuarioEncontrado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la solicitud de usuario"});
          if(!usuarioEncontrado) return res.status(500).send({mensaje:"Error al obtener el usuario o no hay datos"});

          return res.status(200).send({usuarioEncontrado});



     })



}

function login(req,res){
     var params = req.body;

     Usuario.findOne({Usuario: params.Usuario}, (err, usuarioEncontrado)=> {
          if(err) return res.status(500).send({mensaje: "Error en la peticion"});

          if(usuarioEncontrado){
               
               bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{

                    if(passVerificada){
                         if(params.getToken == "true"){

                                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado) })



                         }else{
                              console.log({token: jwt.createToken(usuarioEncontrado)})

                              usuarioEncontrado.password = undefined;

                                   return res.status(200).send({usuarioEncontrado})
                              

                         }



                    }else{
                         return res.status(500).send({mensaje:"el usuario no se a podido identificar"})
                    }


               })


     }else{
          return res.status(500).send({mensaje:"error al buscar el usuario"})

     }
     
})

}


function editarUsuario(req, res)
{
   
     var id = req.params.id;
     var params = req.body;

  //borrar la propiedad password

     delete params.password;
  

     if(req.user.rol != "ROL_ADMIN"){

console.log(req.user.sub)
console.log(req.params.id)
          if(String(id) != String(req.user.sub) ){
               return res.status(500).send({mensaje:"no se puede modificar otro usuario "});
               
          }
     }
     
     if(params.rol){
     if(params.rol != "ROL_ADMIN" && params.rol != "ROL_CLIENTE" && params.rol != "ROL_DUEÑO") return res.status(404).send({mensaje:"No existe ese rol, pruebe con ROL_DUEÑO o ROL_CLIENTE"})
     }

     if(String(id) === String(req.user.sub)&& req.user.rol === "ROL_ADMIN" ){
          return res.status(500).send({mensaje:"admin no intente modificarse"});
     }

     if(String(id) != String(req.user.sub) && req.user.rol === "ROL_ADMIN" && (params.Usuario || params.password) ){
               
          delete params.Usuario;
     
     }

     Usuario.findById(id,(err, User) => {
          if(err) return res.status(500).send({mensaje: "Error"})

          console.log(User)

     Hoteles.find({DueñoUsuario: User.Usuario}).exec((err, Usuarios)=>{
          if(err) return res.status(500).send({mensaje: "Error"})
          console.log(Usuarios)
          if(Usuarios.length > 0) return res.status(500).send({mensaje:"No se puede editar a un dueño sin antes eliminar el hotel"})
    




     Usuario.findOneAndUpdate({_id:id}, params, {new:true},(err, usuarioactualizado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la peticion"})
          if(!usuarioactualizado) return res.status(500).send({mensaje:"No se ha podido editar el usuario"});
          
          return res.status(200).send({usuarioactualizado});
     
     })
     }
     )
})

}








function EliminarUsuario(req, res){
     let Nombre = req.params.nombre
     console.log(Nombre)


     if(req.user.rol ==="ROL_ADMIN" && req.user.sub === Nombre){

          return res.status(400).send({mensaje:"Eliminar al admin es IMPOSIBLE, por favor no vuelva de intentarlo"})
     }

     if(req.user.sub != Nombre && req.user.rol != "ROL_ADMIN" ){
          return res.status(500).send({mensaje:"No puedes eliminar a otro Usuario"})
     }

     if(req.user.rol === "ROL_ADMIN" ){
          return res.status(500).send({mensaje:"El admin no puede eliminar usuarios"})
     }
     Usuario.find({_id:Nombre}).exec((err, Usuarios)=>{
          if(err) return res.status(500).send({mensaje: "Error"})
    
          console.log()
          Reservacion.find({Usuario:Usuarios[0]._id}).exec((err,reservacion)=>{
               if(err) return res.status(500).send({mensaje: "Error"})
               if(reservacion.length > 0) return res.status(500).send({mensaje:"Este usuario tiene reservaciones, por lo cual no puede eliminarse"})
         


          Hoteles.find({DueñoUsuario:Nombre}).exec((err, TieneHotel)=>{
               if(err) return res.status(500).send({mensaje: "Error"})
               if(TieneHotel.length > 0) return res.status(500).send({mensaje:"Este usuario esta enlazado con un hotel elimine antes el hotel"})
         

               Usuario.findOneAndDelete({_id:Nombre}, (err, UsuarioEliminado)=>{
                    if(err) return res.status(500).send({mensaje: "Error al eliminar al usuario"})
                    if(!UsuarioEliminado) return res.status(500).send({mensajes:"Error al eliminar o El usuario ya ha sido eliminado"})
                    
                    
                    return res.status(200).send({UsuarioEliminado})



               })

          }) 
          })

     })


}






module.exports = { registrar, obtenerUsuario, obtenerUsuarioID, editarUsuario, login, UserAdmin, EliminarUsuario}