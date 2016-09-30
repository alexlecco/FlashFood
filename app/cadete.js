'use strict';

import {
  Container, Header, Title, Content, Footer,
  Grid, Col, Row,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Spinner, Icon, Badge, H1,
} from 'native-base';
import React, { Component } from 'react';
import { Image } from 'react-native';

import {Usuario, Pedido, Plato, Estados, } from './datos'
const styles = require('./styles.js')
import { Pantalla } from './pantalla';

export default class Cadete extends Component {
    constructor(props){
      super(props)

      this.state = { usuario: false, platos: false, pedidos: false }
      Usuario.registrar(this)
      Plato.registrar(this)
      Pedido.registrar(this)
    }

    componentDidMount() {
      const cadete = this.props.id
      Usuario.observar(cadete)
      Usuario.observar( usuario => usuario.esCliente || usuario.esCocinero )

      Plato.observar( plato => plato.activo )
      Pedido.observar( pedido => pedido.enEntrega(cadete) )
    }

    componentWillUnmount(){
      const cadete = this.props.id
      Usuario.detener(cadete)
      Usuario.detener()

      Plato.detener()
      Pedido.detener()
    }

    alElegir = (pedido) => {
      const cadete = this.props.id
      if(pedido.estado == Estados.disponible){
        pedido.retirar(cadete)
      } else {
        pedido.entregar()
      }
    }


    render(){
      const cadete = this.props.id

      const {usuario, platos, pedidos, usuarios}  = this.state
      const hayDatos  = usuario && platos && pedidos

      if(!hayDatos) { return <Cargando /> }

      const pedido  = pedidos[0]
      if(!pedido){ return <Libre {...this.props} />}

      const plato    = platos.find(plato => plato.id === pedido.plato)
      const cocinero = usuarios.find(usuario => usuario.id === pedido.cocinero)
      const cliente  = usuarios.find(usuario => usuario.id === pedido.cliente)

      return <Envio {...this.props} pedido={pedido} plato={plato} cocinero={cocinero} cliente={cliente} alElegir={ this.alElegir } />
    }
  }

  const Envio = (props) => {
    const { pedido, plato, cliente, cocinero, alElegir, alSalir } = props

    const accion = pedido.estado === Estados.disponible ? 'Retirar ya!' : 'Entregar ya!'
    return (
      <Container>
        <Header>
          <Title>Envio</Title>
          <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
        </Header>
        <Content>
          <View style={Pantalla.contenido}>
            <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)}>
              <Precio precio={plato.precio} />
            </Image>
            <View style={{marginTop: Pantalla.separacion}}>
              <Text style={styles.plato_descripcion}> {plato.descripcion} </Text>
              <Text style={styles.plato_detalle}> {plato.detalle} </Text>
              {pedido.estado === Estados.disponible && <Cocinero {...props} />}
              {pedido.estado === Estados.retirado   && <Cliente  {...props} />}
            </View>
            <Button block style={Pantalla.accion} onPress={ () => alElegir(pedido) }><Text>{accion}</Text></Button>
          </View>
        </Content>
      </Container>
    )
  }

  const Precio = ({precio}) => (
    <View style={{backgroundColor: 'yellow', opacity:0.6, position: 'absolute', right: Pantalla.separacion, bottom: Pantalla.separacion, height: 50, width: 120, alignItems: 'center'}}>
      <Text style={styles.plato_precio}>${precio}</Text>
    </View>
  )

  const Cocinero = (props) => {
    const {pedido, cocinero} = props

    return (
      <Grid>
        <Col><Thumbnail source={{uri: cocinero.foto}} size={100} /></Col>
        <Col>
          <Text style={styles.pedido_descripcion}> Cocinero: </Text>
          <Text style={styles.pedido_cantidad}>{cocinero.nombre}</Text>
          <Text style={styles.pedido_descripcion}> Dirección: </Text>
          <Text style={styles.pedido_cantidad}>{cocinero.domicilio}</Text>
        </Col>
      </Grid>
    )
  }

  const Cliente = (props) => {
    const {pedido, cliente} = props

    return (
      <Grid>
        <Col><Thumbnail source={{uri: cliente.foto}} size={100} /></Col>
        <Col>
          <Text style={styles.pedido_descripcion}> Cliente: </Text>
          <Text style={styles.pedido_cantidad}>{cliente.nombre}</Text>
          <Text style={styles.pedido_descripcion}> Dirección: </Text>
          <Text style={styles.pedido_cantidad}>{cliente.domicilio}</Text>
        </Col>
      </Grid>
    )
  }

  const Cargando = (props) => <View style={{flex:1, alignItems: 'stretch'}}><Spinner style={{flex:1}} color={"blue"} /></View>

  const Libre = (props) => (
      <Container>
        <Header>
          <Title>Envio</Title>
          <Button transparent onPress={ () => props.alSalir() } ><Icon name='ios-home' /></Button>
        </Header>
        <Content>
          <View style={[Pantalla.pagina,{backgroundColor:'red',}]}>
              <Text style={{fontSize:20, alignSelf: 'stretch'}}>No hay pedidos</Text>
          </View>
        </Content>
      </Container>
  )
