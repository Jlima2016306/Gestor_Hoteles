export class factura{
  constructor(
    public _id: String,
    public Usuario: String,
    public Hotel: String,
    public idReservacion: String,
    public FacturaEditable: Boolean,
    public Carrito:String,
    public PrecioServicios: Number,
    public PrecioReservacion: Number,
    public Total: String
  ){}
}
