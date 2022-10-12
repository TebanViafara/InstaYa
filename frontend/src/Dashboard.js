import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openCrearOrdenModal: false,
      openOrdenEditModal: false,
      fecha: '',
      hora: '',
      dimensiones: '',
      direccion_recogida: '',
      ciudad_recogida: '',
      destinatario: '',
      cedula: '',
      direccion_entrega: '',
      ciudad_entrega: '',
      page: 1,
      search: '',
      ordenes: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getorden();
      });
    }
  }

  getorden = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-orden${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, ordenes: res.data.ordenes, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, ordenes: [], pages: 0 },()=>{});
    });
  }

  deleteOrden = (id) => {
    axios.post('http://localhost:2000/delete-orden', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getorden();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getorden();
      });
    }
  };

  crear_orden = () => {
    

    axios.post('http://localhost:2000/crear-orden', {
      fecha: this.state.fecha,
      hora: this.state.hora,
      dimensiones: this.state.dimensiones,
      direccion_recogida: this.state.direccion_recogida,
      ciudad_recogida: this.state.ciudad_recogida,
      nombre_destinatario: this.state.nombre_destinatario,
      cedula_destinatario: this.state.cedula_destinatario,
      direccion_entrega: this.state.direccion_entrega,
      ciudad_entrega: this.state.ciudad_entrega
      }, {
        headers: {
          'Content-Type': 'application/json',
          'token': this.state.token
        }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleordenClose();
      this.setState({ fecha: '', hora: '', dimensiones: '', direccion_recogida: '', ciudad_recogida: '', destinatario:'', page: 1 }, () => {
        this.getorden();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleordenClose();
    });

  }

  updateOrden = () => {

    axios.post('http://localhost:2000/update-orden', {
        id: this.state.id,
        estado: this.state.estado,
        fecha: this.state.fecha,
        hora: this.state.hora,
        dimensiones: this.state.dimensiones,
        direccion_recogida: this.state.direccion_recogida,
        ciudad_recogida: this.state.ciudad_recogida,
        nombre_destinatario: this.state.nombre_destinatario,
        cedula_destinatario: this.state.cedula_destinatario,
        direccion_entrega: this.state.direccion_entrega,
        ciudad_entrega: this.state.ciudad_entrega
      }, {
        headers: {
          'Content-Type': 'application/json',
          'token': this.state.token
        }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleOrdenEditClose();
      this.setState({ fecha: '',
        hora: '',
        dimensiones: '',
        direccion_recogida: '',
        ciudad_recogida: '',
        nombre_destinatario: '',
        cedula_destinatario: '',
        direccion_entrega: '',
        ciudad_entrega: '' }, () => {
        this.getorden();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleOrdenEditClose();
    });

  }

  handleOrdenOpen = () => {
    this.setState({
      openCrearOrdenModal: true,
      fecha: '',
      hora: '',
      dimensiones: '',
      direccion_recogida: '',
      ciudad_recogida: '',
      nombre_destinatario: '',
      cedula_destinatario: '',
      direccion_entrega: '',
      ciudad_entrega: ''
    });
  };

  handleordenClose = () => {
    this.setState({ openCrearOrdenModal: false });
  };

  handleOrdenEditOpen = (data) => {
    this.setState({
      openOrdenEditModal: true,
      id: data._id,
      fecha: data.fecha,
      hora: data.hora,
      dimensiones: data.dimensiones,
      direccion_recogida: data.direccion_recogida,
      ciudad_recogida: data.ciudad_recogida,
      nombre_destinatario: data.nombre_destinatario,
      cedula_destinatario: data.cedula_destinatario,
      direccion_entrega: data.direccion_entrega,
      ciudad_entrega: data.ciudad_entrega
    });
  };

  handleOrdenEditClose = () => {
    this.setState({ openOrdenEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleOrdenOpen}
          >
            Agregar Orden
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Cerrar Session
          </Button>
        </div>

        {/* Modificar Orden */}
        <Dialog
          open={this.state.openOrdenEditModal}
          onClose={this.handleordenClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Modificar Orden</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="id_orden"
              value={this.state.id_orden}
              onChange={this.onChange}
              placeholder="id"
              disabled
            /><br /><br />
            <select value={this.state.estado}>
            <option value="cancelado">cancelado</option>
            <option value="cumplido">cumplido</option>
          </select><br /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="dimensiones"
              value={this.state.dimensiones}
              onChange={this.onChange}
              placeholder="Ancho X Largo X Alto"
              required
            /><br /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="direccion_recogida"
              value={this.state.direccion_recogida}
              onChange={this.onChange}
              placeholder="direccion recogida"
              required
            /><br /><br />
            <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="ciudad_recogida"
            value={this.state.ciudad_recogida}
            onChange={this.onChange}
            placeholder="ciudad recogida"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="nombre_destinatario"
            value={this.state.nombre_destinatario}
            onChange={this.onChange}
            placeholder="nombre destinatario"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="cedula_destinatario"
            value={this.state.cedula_destinatario}
            onChange={this.onChange}
            placeholder="cedula destinatario"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="direccion_entrega"
            value={this.state.direccion_entrega}
            onChange={this.onChange}
            placeholder="direccion entrega"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="ciudad_entrega"
            value={this.state.ciudad_entrega}
            onChange={this.onChange}
            placeholder="ciudad entrega"
            required
          /><br /><br />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleOrdenEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.ciudad_entrega == ''}
              onClick={(e) => this.updateOrden()} color="primary" autoFocus>
              modificar Orden
            </Button>
          </DialogActions>
        </Dialog>

        {/* Agregar orden */}
        <Dialog
          open={this.state.openCrearOrdenModal}
          onClose={this.handleordenClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Crear Orden</DialogTitle>
          <DialogContent><br />
            <TextField
              id="standard-basic"
              type="date"
              autoComplete="off"
              name="fecha"
              value={this.state.fecha}
              onChange={this.onChange}
              placeholder="Fecha"
              required
            /><br /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="hora"
              value={this.state.hora}
              onChange={this.onChange}
              placeholder="hora 00:00:00"
              required
            /><br /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="dimensiones"
              value={this.state.dimensiones}
              onChange={this.onChange}
              placeholder="Ancho X Largo X Alto"
              required
            /><br /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="direccion_recogida"
              value={this.state.direccion_recogida}
              onChange={this.onChange}
              placeholder="direccion recogida"
              required
            /><br /><br />
            <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="ciudad_recogida"
            value={this.state.ciudad_recogida}
            onChange={this.onChange}
            placeholder="ciudad recogida"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="nombre_destinatario"
            value={this.state.nombre_destinatario}
            onChange={this.onChange}
            placeholder="nombre destinatario"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="cedula_destinatario"
            value={this.state.cedula_destinatario}
            onChange={this.onChange}
            placeholder="cedula destinatario"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="direccion_entrega"
            value={this.state.direccion_entrega}
            onChange={this.onChange}
            placeholder="direccion entrega"
            required
          /><br /><br />
          
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="ciudad_entrega"
            value={this.state.ciudad_entrega}
            onChange={this.onChange}
            placeholder="ciudad entrega"
            required
          /><br /><br />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleordenClose} color="primary">
              Cancelar
            </Button>
            <Button
              disabled={this.state.fecha == '' || this.state.hora == '' || this.state.nombre_destinatario == '' || this.state.cedula_destinatario == '' || this.state.direccion_entrega == ''
              || this.state.direccion_recogida == '' || this.state.ciudad_recogida == ''|| this.state.ciudad_entrega == ''}
              onClick={(e) => this.crear_orden()} color="primary" autoFocus>
              Crear
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="Buscar"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Buscar Orden Por nombre destinatario"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">nombre destinatario</TableCell>
                <TableCell align="center">cedula destinatario</TableCell>
                <TableCell align="center">ciudad_recogida</TableCell>
                <TableCell align="center">ciudad entrega</TableCell>
                <TableCell align="center">fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.ordenes.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center" component="th" scope="row">
                    {row._id}
                  </TableCell>
                  <TableCell align="center">{row.nombre_destinatario}</TableCell>
                  <TableCell align="center">{row.cedula_destinatario}</TableCell>
                  <TableCell align="center">{row.ciudad_recogida}</TableCell>
                  <TableCell align="center">{row.ciudad_entrega}</TableCell>
                  <TableCell align="center">{row.fecha}</TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleOrdenEditOpen(row)}
                    >
                      Modificar
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteOrden(row._id)}
                    >
                      Eliminar
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>

      </div>
    );
  }
}