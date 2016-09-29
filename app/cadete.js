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

    console.log("ENVIO plato", pedido)
    const accion = pedido.estado === Estados.disponible ? 'Retirar ya!' : 'Entregar ya!'
    return (
      <Container>
        <Header>
          <Title>Envio</Title>
          <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
        </Header>
        <Content style={{flex:1}}>
          <Card style={{margin: 10}}>
            <CardItem header>
              <H1>{accion}</H1>
            </CardItem>
            <CardItem style={{flex:2}}>
              <Image source={{uri: plato.foto}} style={{width:340, height: 340/(4/3), alignSelf: 'center'}} />
            </CardItem>
            <CardItem >
              <Text style={{fontSize: 12, textAlign: 'center'}}>{plato.descripcion}</Text>
            </CardItem>
              {pedido.estado === Estados.disponible && <Cocinero {...props} />}
              {pedido.estado === Estados.retirado   && <Cliente  {...props} />}
          </Card>
        </Content>
        <Footer>
          <Button block style={{alignSelf: 'center', flex:1}} onPress={ () => alElegir(pedido) }><Text>{accion}</Text></Button>
        </Footer>
      </Container>
    )
  }

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
          <View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: Pantalla.ancho,
            height: Pantalla.alto,
            backgroundColor:'red',
            alignSelf:'center'}}>
              <Text style={{fontSize:20, alignSelf: 'stretch'}}>No hay pedidos</Text>
          </View>
        </Content>
      </Container>
  )
