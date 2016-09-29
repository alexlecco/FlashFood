'use strict';

import {
  Container, Header, Title, Subtitle, Content, Footer,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Spinner, Icon, Badge,
} from 'native-base';

import React, { Component } from 'react';
import {  Grid, Row, Col, } from 'react-native-easy-grid';

import { Usuario, Datos } from './datos';

// var DigitsAuthenticateButton = require('./DigitsAuthenticateButton');

const styles = require('./styles.js')
import { Pantalla } from './pantalla';
import Acciones from './acciones';

import Cliente  from './cliente';
import Cadete   from './cadete';
import Cocinero from './cocinero';

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
    const { usuarios, usuario } = this.state

    // return <RegistroInicial />
    if(!usuarios)  { return <Cargando /> }

    if(!usuario) { return <ElegirUsuario usuarios={usuarios} alElegir={ usuario => this.alIngresar(usuario)} />}

    console.log("RENDER Usuario:", usuario)
    if(usuario.esCliente ) { return <Cliente  id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esCocinero) { return <Cocinero id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esCadete)   { return <Cadete   id={usuario.id} alSalir={ () => this.alSalir() }/> }
  }
}

const Cargando = (props) => <View style={{ flex:1, alignItems: 'stretch' }}><Spinner style={{ flex:1 }} color={ "green" } /></View>

const RegistroInicial = (props) => (
    <Container>
      <Header>
        <Title>Ingresar al Sistema</Title>
      </Header>
      <Content>
        <Text>Antes</Text>
          <DigitsAuthenticateButton />
        <Text>Despues</Text>
      </Content>
    </Container>
)

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
        <Title>El Plato del Día - Administración</Title>
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
                <Text style={styles.usuario_nombre}>{usuario.nombre}</Text>
                <Text style={styles.usuario_id}>id:{usuario.id}</Text>
              </ListItem>
            }>
      </List>
   </View>
 )
}
