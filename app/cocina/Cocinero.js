'use strict';
import React, { Component } from 'react';
import { Image } from 'react-native';

import { Container, Header, Title, Content, Grid, Col, Row, List, ListItem, Card, CardItem, Button, Text, View, Spinner, Icon, Thumbnail, } from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';
import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla, Item } from './../styles';

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

  calcularComandaDetallada(){
    const {pedidos, platos, usuarios} = this.state

    return pedidos.sort(Pedido.ordenCronologico).map( pedido => ({
          cliente: usuarios.find( cliente => cliente.id === pedido.cliente ),
          plato:   platos.find( plato => plato.id === pedido.plato ),
          pedido:  pedido })
        )
  }

  render(){
    const {usuario, platos, pedidos}  = this.state
    const hayDatos = usuario && platos && pedidos

    if(!hayDatos) { return <Cargando /> }

    const comanda = this.calcularComandaDetallada()
    return (<AdministrarComanda {...this.props} cocinero={usuario} comanda={comanda} alAceptar={this.alAceptar} alDisponer={this.alDisponer} />)
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
        <List dataArray={comanda} renderRow={(item) => <ItemPedido {...props} item={item} />} />
      </Content>
    </Container>
  )
}

const ItemPedido = ({item: {cliente, plato, pedido}, alAceptar, alDisponer}) =>
  <ListItem>

      <Card>
        <CardItem header>
          <Text>{cliente.nombre}</Text>
        </CardItem>
        <CardItem>
          <Grid>
            <Col>
            <View style={Item.centrar}>
              <Thumbnail source={{uri: cliente.foto}} size={80} />
            </View>
            </Col>
            <Col>
              <View style={Item.centrar}>
                <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3, 0.3)} />
              </View>
            </Col>
            <Col>
              <View style={Item.centrar}>
                {pedido.estado === Estados.pedido && <Button onPress={ () => alAceptar(plato) }> Producir </Button>}
                {pedido.estado === Estados.aceptado && <Button success onPress={ () => alDisponer(plato)}> Entregar </Button>}
                {pedido.estado === Estados.entregado && <Text> Esperando valoración... </Text>}
              </View>
            </Col>
          </Grid>
        </CardItem>
        <CardItem footer>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{plato.descripcion}</Text>
          </View>
        </CardItem>
      </Card>

  </ListItem>

  // calcularComanda(){
  //   const {pedidos, platos, usuarios} = this.state
  //
  //   var comanda = {}
  //   platos.forEach( plato => comanda[plato.id] = { plato, estados: {} } )
  //   pedidos.forEach( ({plato, estado}) => {
  //       const estados = comanda[plato].estados
  //       estados[estado] = (estados[estado] || 0) + 1
  //     }
  //   )
  //   return Object.keys(comanda).map(plato => comanda[plato])
  // }
  //
  // render(){
  //   const {usuario, platos, pedidos}  = this.state
  //   const hayDatos = usuario && platos && pedidos
  //
  //   if(!hayDatos) { return <Cargando /> }
  //
  //   const comanda = this.calcularComanda()
  //   console.log("CALCULAR COMANDA DETALLADA", this.calcularComandaDetallada() )
  //
  //   return (<AdministrarComanda {...this.props} cocinero={usuario} comanda={comanda} alAceptar={this.alAceptar} alDisponer={this.alDisponer}/>)
  // }

  // const ItemComanda = ({item: {plato, estados}, alAceptar, alDisponer}) =>
  //   <ListItem>
  //     <Grid>
  //       <Col>
  //         <Card style={{marginRight:5}}>
  //           <CardItem>
  //             <Text style={{fontSize:12, textAlign: 'center'}}>{plato.descripcion}</Text>
  //           </CardItem>
  //           <CardItem >
  //             <Image source={{uri: plato.foto}} style={{width:170, height: 170/(4/3), alignSelf: 'center'}} />
  //           </CardItem>
  //         </Card>
  //       </Col>
  //       <Col>
  //         <Card>
  //           <CardItem>
  //             <Grid>
  //               <Col>
  //                 <Text style={Estilo.pedido.descripcion}>Esperando</Text>
  //                 <Text style={Estilo.pedido.cantidad}>{estados[Estados.pedido] || ""}</Text>
  //               </Col>
  //               <Col>
  //                 {estados[Estados.pedido] && <Button onPress={ () => alAceptar(plato) }>Producir</Button>}
  //               </Col>
  //             </Grid>
  //           </CardItem>
  //           <CardItem>
  //             <Grid>
  //               <Col>
  //                 <Text style={Estilo.pedido.descripcion}>Cocinado</Text>
  //                 <Text style={Estilo.pedido.cantidad}>{estados[Estados.aceptado] || ""}</Text>
  //               </Col>
  //               <Col>
  //                 {estados[Estados.aceptado] && <Button onPress={ () => alDisponer(plato)}>Entregar</Button>}
  //               </Col>
  //             </Grid>
  //           </CardItem>
  //           <CardItem>
  //             <Text style={Estilo.pedido.descripcion}>Disponible</Text>
  //             <Text style={Estilo.pedido.cantidad}>{estados[Estados.disponible] || ""}</Text>
  //           </CardItem>
  //         </Card>
  //       </Col>
  //     </Grid>
  //   </ListItem>
  //
  // const AdministrarComanda = (props) => {
  //   const { comanda, cocinero, alSalir } = props
  //   return (
  //     <Container>
  //       <Header>
  //         <Title>Comanda para [{cocinero.id}]</Title>
  //         <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
  //       </Header>
  //       <Content style={{flex:1}}>
  //         <List dataArray={comanda} renderRow={(item) => <ItemComanda {...props} item={item}/>} />
  //       </Content>
  //     </Container>
  //   )
  // }

export { Cocinero };
