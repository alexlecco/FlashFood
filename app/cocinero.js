'use strict';

import {
  Container, Header, Title, Content, Footer,
  Grid, Col, Row,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Spinner, Icon, Badge,
} from 'native-base';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {Usuario, Plato, Pedido, Estados} from './datos'
const styles = require('./styles.js')

export default class Cocinero extends Component {
    constructor(props){
      super(props)

      this.state = { cocinero: false, platos: false, pedidos: false }

      Usuario.registrar(this)
      Plato.registrar(this)
      Pedido.registrar(this)
    }

    componentDidMount() {
      const cocinero = this.props.id
      Usuario.observar(cocinero, 'cocinero')
      Plato.observar(plato => plato.activo)
      Pedido.observar(pedido => pedido.enCocina(cocinero))
    }

    componentWillUnmount(){
      const cocinero = this.props.id
      Usuario.detener(cocinero)

      Plato.detener()
      Pedido.detener()
    }

    alAceptar(plato){
        const {pedidos} = this.state
        const cocinero = this.props.id
        const pedido = pedidos.filter(pedido => pedido.plato == plato.id && pedido.estado == Estados.pedido)[0]
        console.log("AL_ACEPTAR", pedido)
        pedido && pedido.aceptar(cocinero)
    }

    alDisponer(plato){
      const {pedidos} = this.state
      const pedido = pedidos.filter(pedido => pedido.plato == plato.id && pedido.estado == Estados.aceptado)[0]

      pedido && pedido.disponer()
    }

    calcularComanda(){
      const {pedidos, platos} = this.state

      var comanda = {}
      platos.forEach( plato => comanda[plato.id] = { plato, estados: {} } )
      pedidos.forEach( ({plato, estado}) => {
          const estados = comanda[plato].estados
          estados[estado] = (estados[estado] || 0) + 1
        }
      )
      return Object.keys(comanda).map(plato => comanda[plato])
    }

    render(){
      const {usuario, platos, pedidos}  = this.state
      const hayDatos = usuario && platos && pedidos

      if(!hayDatos) { return <Cargando /> }

      const comanda = this.calcularComanda()
      console.log("CALCULAR COMANDA", comanda)

      return (<AdministrarComanda {...this.props} cocinero={usuario} comanda={comanda} alAceptar={plato => this.alAceptar(plato)} alDisponer={plato => this.alDisponer(plato)}/>)
    }
  }

  const ItemComanda = (props) => {
    const {item: {plato, estados}, alAceptar, alDisponer} = props

    return (
      <ListItem>
        <Grid>
          <Col>
            <Card style={{marginRight:5}}>
              <CardItem header>
                <Text style={{fontSize:12, textAlign: 'center'}}>{plato.descripcion}</Text>
              </CardItem>
              <CardItem >
                <Image source={{uri: plato.foto}} style={{width:170, height: 170/(4/3), alignSelf: 'center'}} />
              </CardItem>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardItem>
                <Grid>
                  <Col>
                    <Text style={styles.pedido_descripcion}>Esperando</Text>
                    <Text style={styles.pedido_cantidad}>{estados[Estados.pedido] || "😀"}</Text>
                  </Col>
                  <Col>
                    {estados[Estados.pedido] && <Button onPress={ () => alAceptar(plato) }>Producir</Button>}
                  </Col>
                </Grid>
              </CardItem>
              <CardItem>
                <Grid>
                  <Col>
                    <Text style={styles.pedido_descripcion}>Cocinado</Text>
                    <Text style={styles.pedido_cantidad}>{estados[Estados.aceptado] || "😟"}</Text>
                  </Col>
                  <Col>
                    {estados[Estados.aceptado] && <Button onPress={ () => alDisponer(plato)}>Entregar</Button>}
                  </Col>
                </Grid>
              </CardItem>
              <CardItem>
                <Text style={styles.pedido_descripcion}>Disponible</Text>
                <Text style={styles.pedido_cantidad}>{estados[Estados.disponible] || "🙄"}</Text>
              </CardItem>
            </Card>
          </Col>
        </Grid>
      </ListItem>
    )
  }

  const AdministrarComanda = (props) => {
    const { comanda, cocinero, alSalir } = props
    return (
      <Container>
        <Header>
          <Title>Comanda para {cocinero.id}</Title>
          <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
        </Header>
        <Content style={{flex:1}}>
          <List dataArray={comanda} renderRow={(item) => <ItemComanda {...props} item={item}/>} />
        </Content>

      </Container>
    )
  }

const Cargando = (props) => <View style={{flex:1, alignItems: 'stretch'}}><Spinner style={{flex:1}} color={"blue"} /></View>

console.log("IMPORT: Cocinero")
