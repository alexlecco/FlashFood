'use strict';
import React, { Component } from 'react';
import { Image } from 'react-native';

import { Container, Header, Title, Content, Grid, Col, Row, List, ListItem, Card, CardItem, Button, Text, View, Spinner, Icon, } from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';
import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

class Cocinero extends Component {
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
    Usuario.observar(usuario => usuario.esCliente)
    Plato.observar(plato => plato.activo)
    Pedido.observar(pedido => pedido.enCocina(cocinero))
  }

  componentWillUnmount(){
    const {cocinero} = this.state
    cocinero && cocinero.detener()

    Usuario.detener()
    Plato.detener()
    Pedido.detener()
  }

  alAceptar = (plato) => {
      const { pedidos } = this.state
      const cocinero = this.props.id
      const pedido = pedidos.find(pedido => pedido.plato === plato.id && pedido.estado === Estados.pedido)
      pedido && pedido.aceptar(cocinero)
  }

  alDisponer = (plato) => {
    const { pedidos } = this.state
    const cocinero = this.props.id

    const pedido = pedidos.find(pedido => pedido.plato === plato.id && pedido.estado === Estados.aceptado && pedido.cocinero === cocinero)
    pedido && pedido.entregar()
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

  organizarComanda(){
    const {pedidos, platos, usuarios} = this.state

  }

  render(){
    const {usuario, platos, pedidos}  = this.state
    const hayDatos = usuario && platos && pedidos

    if(!hayDatos) { return <Cargando /> }

    const comanda = this.calcularComanda()
    console.log("CALCULAR COMANDA", comanda)

    return (<AdministrarComanda {...this.props} cocinero={usuario} comanda={comanda} alAceptar={this.alAceptar} alDisponer={this.alDisponer}/>)
  }
}

const AdministrarComanda = (props) => {
  const { comanda, cocinero, alSalir } = props
  return (
    <Container>
      <Header>
        <Title>Comanda para [{cocinero.id}]</Title>
        <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
      </Header>
      <Content style={{flex:1}}>
        <List dataArray={comanda} renderRow={(item) => <ItemComanda {...props} item={item}/>} />
      </Content>
    </Container>
  )
}

const ItemPedido = ({pedido}) =>
  <ListItem>
    <Grid>
      <Col>
        <Row><Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3, 0.3)} /></Row>
        <Row><Text>{plato.descripcion}</Text></Row>
      </Col>
      <Col>
        <Row><Thumbnail source={{uri: cliente.foto}} size={100} /></Row>
        <Row><Text>{cliente.nombre}</Text></Row>
      </Col>
      <Col>
        <Button onPress={ () => alAceptar(plato) }>Producir</Button>}
        <Text>{pedido.hora}</Text>
      </Col>
    </Grid>
  </ListItem>

const ItemComanda = ({item: {plato, estados}, alAceptar, alDisponer}) =>
  <ListItem>
    <Grid>
      <Col>
        <Card style={{marginRight:5}}>
          <CardItem>
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
                <Text style={Estilo.pedido.descripcion}>Esperando</Text>
                <Text style={Estilo.pedido.cantidad}>{estados[Estados.pedido] || ""}</Text>
              </Col>
              <Col>
                {estados[Estados.pedido] && <Button onPress={ () => alAceptar(plato) }>Producir</Button>}
              </Col>
            </Grid>
          </CardItem>
          <CardItem>
            <Grid>
              <Col>
                <Text style={Estilo.pedido.descripcion}>Cocinado</Text>
                <Text style={Estilo.pedido.cantidad}>{estados[Estados.aceptado] || ""}</Text>
              </Col>
              <Col>
                {estados[Estados.aceptado] && <Button onPress={ () => alDisponer(plato)}>Entregar</Button>}
              </Col>
            </Grid>
          </CardItem>
          <CardItem>
            <Text style={Estilo.pedido.descripcion}>Disponible</Text>
            <Text style={Estilo.pedido.cantidad}>{estados[Estados.disponible] || ""}</Text>
          </CardItem>
        </Card>
      </Col>
    </Grid>
  </ListItem>

const ItemComanda1 = ({item: {plato, estados}, alAceptar, alDisponer}) =>
  <ListItem style={{height: 200, borderColor:'blue', borderWidth:1, borderRadius: 5}}>
    <Grid style={{borderColor:'red',borderWidth:2}}>
      <Col>
        <Row>
          <Text style={{fontSize:12, textAlign: 'center'}}>{plato.descripcion}</Text>
        </Row>
        <Row>
          <Image source={{uri: plato.foto}} style={{width:150, height: 150/(4/3), alignSelf: 'center'}} />
        </Row>
      </Col>

      <Col>
        <Row>
          <Col>
            <Text style={Estilo.pedido.descripcion}>Esperando</Text>
            <Text style={Estilo.pedido.cantidad}>{estados[Estados.pedido] || ""}</Text>
          </Col>
          <Col>
            {estados[Estados.pedido] && <Button onPress={ () => alAceptar(plato) }>Producir</Button>}
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={Estilo.pedido.descripcion}>Cocinado</Text>
            <Text style={Estilo.pedido.cantidad}>{estados[Estados.aceptado] || ""}</Text>
          </Col>
          <Col>
            {estados[Estados.aceptado] && <Button onPress={ () => alDisponer(plato)}>Entregar</Button>}
          </Col>
        </Row>
        <Row>
          <Text style={Estilo.pedido.descripcion}>Disponible</Text>
          <Text style={Estilo.pedido.cantidad}>{estados[Estados.disponible] || ""}</Text>
        </Row>
      </Col>
    </Grid>
  </ListItem>

console.log("IMPORT: Cocinero")

export { Cocinero };
