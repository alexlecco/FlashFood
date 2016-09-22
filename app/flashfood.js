'use strict';

import {
  Container, Header, Title, Content, Footer,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Spinner, Icon, Badge,
} from 'native-base';
import React, { Component } from 'react';
import {  Grid, Row, Col, } from 'react-native-easy-grid';

import { Usuario, Datos } from './datos';

// import Ingresar from './ingresar';
// import Platos   from './platos';
// import Usuarios from './usuarios';
const styles = require('./styles.js')

import Cliente  from './cliente';
import Cadete   from './cadete';
import Cocinero from './cocinero';

export default class FlashFood extends Component {

  constructor (props){
    super(props)
    // Datos.cargar()
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

    if(!usuarios)  { return <Cargando /> }

    if(!usuario) { return <ElegirUsuario usuarios={usuarios} alElegir={ usuario => this.alIngresar(usuario)} />}

    console.log("RENDER Usuario:", usuario)
    if(usuario.esCliente ) { return <Cliente  id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esCocinero) { return <Cocinero id={usuario.id} alSalir={ () => this.alSalir() }/> }
    if(usuario.esCadete)   { return <Cadete   id={usuario.id} alSalir={ () => this.alSalir() }/> }
  }
}

const Cargando = (props) => <View style={{ flex:1, alignItems: 'stretch' }}><Spinner style={{ flex:1 }} color={ "green" } /></View>

const ElegirUsuario = (props) => {
  const clientes  = props.usuarios.filter( u => u.esCliente  )
  const cocineros = props.usuarios.filter( u => u.esCocinero )
  const cadetes   = props.usuarios.filter( u => u.esCadete )

  return (
    <Container>
      <Header>
        <Title>Ingresar al Sistema</Title>
      </Header>
      <Content>
        <ListarUsuarios titulo="Clientes"  {...props} usuarios={clientes} />
        <ListarUsuarios titulo="Cocineros" {...props} usuarios={cocineros} />
        <ListarUsuarios titulo="Cadetes"   {...props} usuarios={cadetes} />
      </Content>
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
