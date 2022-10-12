var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	nombre: String,
	cedula: String,
	correo: String,
	password: String
}),
user = mongoose.model('user', userSchema);

module.exports = user;