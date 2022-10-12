var mongoose = require('mongoose');
var Schema = mongoose.Schema;

OrdenSchema = new Schema( {
	fecha: Date,
	hora: String,
	dimensiones: String,
	direccion_recogida: String,
	ciudad_recogida: String,
	nombre_destinatario:String,
	cedula_destinatario:String,
	direccion_entrega:String,
	ciudad_entrega:String,
	estado: { type: String, default: 'Guardado' },
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
ordenes = mongoose.model('ordenes', OrdenSchema);

module.exports = ordenes;