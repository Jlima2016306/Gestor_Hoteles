export class carrito{
  constructor(
    public _id: String,
    public Usuario: String,
    public Hotel: String,
    public CarritoFacturado : boolean,
    public Nombre : String,
    public Carrito: [{
      Nombre: String,
      Descripcion: String,
      Precio: String
    }],
    public PrecioServicios: Number
  ){}
}

