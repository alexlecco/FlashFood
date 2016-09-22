'use strict';

import {
  Container, Header, Title, Content, Footer,
  Grid, Col, Row,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Spinner, Icon,
} from 'native-base';

import React, { Component } from 'react';
import { Dimensions, Image } from 'react-native';
import StarRating from 'react-native-star-rating';

import { Usuario, Plato, Pedido, Estados } from './datos'

const styles = require('./styles.js')

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

const EsperaMaxima = 30 * 60 // 30 minutos o GRATIS

export default class Cliente extends Component {

  constructor(props){
    super(props)
    this.state = { usuario: false, platos: false, pedidos: false}

    // BINDING
    Usuario.registrar(this)
    Pedido.registrar(this)
    Plato.registrar(this)
  }

  alContar = () => {
    const {contar} = this.state
    this.setState({contar: (contar ||0)+1})
  }

  componentDidMount() {
    const cliente = this.props.id
    Usuario.observar(cliente)
    Pedido.observar(pedido => pedido.enPedido(cliente))
    Plato.observar(plato => plato.activo)

    // this.timer = setInterval( () => this.setState({demora: this.calcularDemoraActual()}), 1000)
    this.timer = setInterval( this.alContar , 1000)
  }

  componentWillUnmount(){
    const { usuario } = this.state
    usuario && usuario.detener()
    Plato.detener()
    Pedido.detener()
    clearInterval(this.timer)
  }

  render(){
    const {usuario, platos, pedidos}  = this.state

    console.log(    "hayUsuario ", !!usuario)
    console.log(    "hayPlatos  ", !!platos,  platos  && platos.length)
    console.log(    "hayPedidos ", !!pedidos, pedidos && pedidos.length, pedidos && pedidos[0])

    const hayDatos   = usuario && platos && pedidos
    const hayPlatos  = platos  && platos.length  > 0
    const hayPedidos = platos  && pedidos && pedidos.length > 0

    if(hayPedidos){
      var pedido = pedidos[0]
      var plato  = platos.find(plato => plato.id === pedido.plato)

      return <SeguirPedido {...this.props} usuario={usuario} pedido={pedido} plato={plato}
                  alCancelar ={ () => pedido.cancelar() }
                  alValorar  ={ valoracion => pedido.valorar(valoracion) } />
    }

    if(hayPlatos){
      return <RealizarPedido {...this.props} usuario={usuario} platos={platos}
                  alElegir={ plato => Pedido.pedir(usuario, plato) } />
    }

    return <Cargando />
  }
}

const RealizarPedido = (props) => {
  const { platos, alElegir, alSalir, usuario } = props
  return (
    <Container>
      <Header>
        <Title>Realizar pedido ({usuario.id})</Title>
        <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
      </Header>
      <Content style={{flex:1}}>
        <List
          dataArray={platos}
          renderRow={ plato =>
          <ListItem>
            <Card>
              <CardItem>
                <Image source={{uri: plato.foto}}  />
              </CardItem>
              <CardItem>
                <Grid>
                  <Col size={3}>
                    <Text style={styles.plato_descripcion}> {plato.descripcion} </Text>
                    <Text style={styles.plato_detalle}> {plato.detalle} </Text>
                  </Col>
                  <Col size={2}>
                    <Text style={styles.plato_precio}> ${plato.precio} </Text>
                    <Button block onPress={ () => alElegir(plato) }> Â¡Pedir Ya! </Button>
                  </Col>
                </Grid>
              </CardItem>
            </Card>
          </ListItem>
        } />
      </Content>
    </Container>
  )
}

const Accion = (props) => {
  switch (props.pedido.estado) {
    case Estados.pedido:
        return (<Button block style={{alignSelf: 'center', width: 400}} onPress={ () => props.alCancelar( props.pedido) }>
                   <Icon name='ios-close-circle' /> Cancelar!
                </Button>)
    case Estados.retirado:
        return (<Text style={{fontSize: 20}}>Esta en camino. Salio {humanizeHora(30*60-props.pedido.demora)}</Text>)
    case Estados.entregado:
        return (<StarRating rating={props.pedido.valoracion} selectedStar={ valoracion => props.alValorar(valoracion)} />)
    case Estados.cancelado:
        return false
    default:
        return (<Text style={{fontSize: 20}}>Esperando... {humanizeHora(30*60-props.pedido.demora)}</Text>)
  }
}

const Pago = (props) => {
  const {demora, precio} = props
  const esTarde = demora > EsperaMaxima
  const total   = esTarde ? `Hoy comes GRATIS` : `Total a pagar $${precio}`
  const detalle = esTarde ? 'Lo sentimos... no llegamos a tiempo' : `Si demoramos mÃ¡s de ${humanizeHora(EsperaMaxima - demora)} es GRATIS`
  const color   = esTarde ? 'red' : 'blue'
  return (
    <CardItem style={{alignItems:'center'}}>
      <Text style={{fontSize: 24, color, fontWeight: 'bold', marginTop:10}}>{total}</Text>
      <Text style={{fontSize: 10, color: 'gray'}}>{detalle}</Text>
    </CardItem>
  )
}

const SeguirPedido = (props) => {
  const { pedido, plato,  alCancelar, alValorar, alSalir, usuario } = props
  const { cadete, estado, cliente } = pedido

  return (
    <Container>
        <Header>
          <Title>Seguimiento ({usuario.id})</Title>
          <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
        </Header>
      <Content>
        <Card style={{margin: 10}}>
            <CardItem header>
              <Text style={styles.plato_descripcion}>  {plato.descripcion} </Text>
            </CardItem>
            <CardItem>
              <Image source={{uri: plato.foto}} />
            </CardItem>
            <Pago precio={plato.precio} demora={pedido.demora} />
            <CardItem>
              <Text note>Estado actual: {pedido.estado} demora: {humanizeHora(pedido.demora)}</Text>
            </CardItem>
        </Card>
      </Content>
      <Footer style={{backgroundColor: 'lightskyblue'}}>
        <Accion {...props} pedido={pedido} />
      </Footer>
    </Container>
  )
}

const Cargando = (props) => <View style={{flex:1, alignItems: 'stretch'}}><Spinner style={{flex:1}} color={"red"} /></View>
console.log("IMPORT: Cliente")
