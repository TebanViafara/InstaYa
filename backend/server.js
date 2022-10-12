var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/InstayaDB");
var fs = require('fs');
var ordenes = require("./model/ordenes.js");
var user = require("./model/user.js");

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/" ) {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'Usuario no autorizado!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo salio mal!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.correo && req.body.password) {
      user.find({ correo: req.body.correo }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Usuario o Contraseña Incorrecta!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Usuario o Contraseña Incorrecta!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Ingrese Los Datos',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo salio mal!',
      status: false
    });
  }

});

/* Registrar Usuario api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.nombre && req.body.cedula && req.body.correo && req.body.password) {

      user.find({ correo: req.body.correo }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            nombre: req.body.nombre,
            cedula: req.body.cedula,
            correo: req.body.correo,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Usuario Creado satisfactoriamente'
              });
            }
          });

        } else {
         res.status(400).json({
            errorMessage: `Usuario ${req.body.correo} ya existe!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'ingrese todos los datos!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'algo salio mal!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.correo, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Logueado.',
        token: token,
        status: true
      });
    }
  });
}

/* Api Crear Orden */
app.post("/crear-orden",  (req, res) => {
  try {
    if (req.body && req.body.fecha && req.body.hora && req.body.dimensiones &&
      req.body.cedula_destinatario) {   

      let nueva_orden = new ordenes({
      fecha : req.body.fecha,
      hora : req.body.hora,
      dimensiones : req.body.dimensiones,
      direccion_recogida : req.body.direccion_recogida,
      ciudad_recogida : req.body.ciudad_recogida,
      nombre_destinatario : req.body.nombre_destinatario,
      cedula_destinatario : req.body.cedula_destinatario,
      direccion_entrega : req.body.direccion_entrega,
      ciudad_entrega : req.body.ciudad_entrega,
      user_id : req.user.id
      });
      nueva_orden.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Orden Creada con exito.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Por favor ingrese todos los campos !'.req,
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo salio mal!',
      status: false
    });
  }
});

/* Api modificar orden */
app.post("/update-orden", (req, res) => {
  try {
   
    if (req.body && req.body.id) {
      ordenes.findByIdAndUpdate(req.body.id, {  
        dimensiones : req.body.dimensiones,
        estado : req.body.estado,
        direccion_recogida : req.body.direccion_recogida,
        ciudad_recogida : req.body.ciudad_recogida,
        nombre_destinatario : req.body.nombre_destinatario,
        cedula_destinatario : req.body.cedula_destinatario,
        direccion_entrega : req.body.direccion_entrega,
        ciudad_entrega : req.body.ciudad_entrega,
      }, { new: true }, (err, data) => {
        if (data) {
          res.status(200).json({
            status: true,
            title: 'Orden Actualizada.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Intenta de nuevo!',
        status: false
      });
    }
   
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo salio mal!',
      status: false
    });
  }
});

/* Api eliminar orden*/
app.post("/delete-orden", (req, res) => {
  try {
    if (req.body && req.body.id) {
      ordenes.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Orden eliminada'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Intenta de nuevo!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo salio mal!',
      status: false
    });
  }
});

/*Api mostrar ordenes por usuario con buscador por cedula */
app.get("/get-orden", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    ordenes.find(query, { date: 1, fecha: 1, hora: 1, dimensiones: 1, direccion_recogida: 1, ciudad_recogida: 1, nombre_destinatario: 1, cedula_destinatario: 1,direccion_entrega: 1,ciudad_entrega: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        ordenes.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Ordenes de Recogidas.',
                ordenes: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'No tienes ordenes creadas!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Algo salio mal!',
      status: false
    });
  }

});

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
