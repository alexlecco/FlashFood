'use strict';

import React, { Component } from 'react';

import { Container, Header, Title, Subtitle, Content, Footer, List, ListItem, Thumbnail, Button, Text, View } from 'native-base';


// var DigitsAuthenticateButton = require('./DigitsAuthenticateButton');

import { Acciones } from './componentes/acciones.js';
import { Pagina, Contenido, Cargando } from './componentes/pagina';
import { Estilos, Estilo, Pantalla } from './styles';
import { Usuario, Datos } from './datos';


import { Cliente }  from './venta/cliente';
import { Cocinero } from './cocina/cocinero';
import { Cadete }   from './entrega/cadete';

import { Examples } from '@shoutem/ui';

export default class FlashFood extends Component {

  constructor (props){
    super(props)

    // Datos.cargarPlatos()
    this.state = { usuarios: false, usuario: false }
    Usuario.registrar(this)
  }

  componentDidMount() {
    Usuario.observar()
  }

  componentWillUnmount(){
    Usuario.detener()
  }

  //ACCIONES DEL SISTEMA
  alIngresar(usuario) { this.setState({ usuario: usuario }) }
  alSalir() { this.setState({ usuario: null }) }

  render() {
    // return <Examples />
    const { usuarios, usuario } = this.state

    if(!usuarios)  { return <Cargando /> }

    if(!usuario) { return <ElegirUsuario usuarios={usuarios} alElegir={ usuario => this.alIngresar(usuario)} />}

    if(usuario.esCliente ) { return <Cliente  id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esCocinero) { return <Cocinero id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esCadete)   { return <Cadete   id={usuario.id} alSalir={ () => this.alSalir() }/> }
  }
}

const ejecutarAccion = (accion) => {
  if(accion==0){ Datos.cargarPlatos() }
  if(accion==1){ Datos.cargarUsuarios() }
  if(accion==2){ Datos.borrarPedidos() }
}

const ElegirUsuario = (props) => {
  const clientes  = props.usuarios.filter( u => u.esCliente  )
  const cocineros = props.usuarios.filter( u => u.esCocinero )
  const cadetes   = props.usuarios.filter( u => u.esCadete )
  const { alEjecutar } = props

  return (
    <Container>
      <Header>
        <Title> El Plato del Día - Administración </Title>
      </Header>
      <Content>
        <ListarUsuarios titulo="Clientes"  {...props} usuarios={clientes} />
        <ListarUsuarios titulo="Cocineros" {...props} usuarios={cocineros} />
        <ListarUsuarios titulo="Cadetes"   {...props} usuarios={cadetes} />
      </Content>
      <Footer>
        <Acciones titulos={["+ Platos", "+ Usuarios", "- Pedidos"]} alElegir={(nroAccion) => ejecutarAccion(nroAccion)} />
      </Footer>
    </Container>
  )
}

const ListarUsuarios = (props) => {
  const { titulo, usuarios } = props
  return (
   <View style={{}}>
      <Text style={{ height: 20, marginLeft:10, marginTop:10 }}>{titulo}</Text>
      <List dataArray={usuarios}
            renderRow={(usuario) =>
              <ListItem style={{ height:80 }} button onPress={() => props.alElegir(usuario)}>
                <Thumbnail source={{uri: usuario.foto}} size={75} />
                <Text style={Estilo.usuario.nombre}>{usuario.nombre}</Text>
                <Text style={Estilo.usuario.id}>id:{usuario.id}</Text>
              </ListItem>
            }>
      </List>
   </View>
 )
}
