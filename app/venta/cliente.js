'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content, Footer,
  Grid, Col, Row,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Spinner, Icon,
} from 'native-base';

import StarRating from 'react-native-star-rating';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

export default class Cliente extends Component {
  constructor(props){
    super(props)
    this.state = { usuario: false, platos: false, pedidos: false}

    // BINDING
    Usuario.registrar(this)
    Pedido.registrar(this)
    Plato.registrar(this)
    this.timer = null
  }

  alContar = () => {
    const {contar} = this.state
    this.setState({contar: (contar ||0)+1})
  }

  activarReloj(){
    const {pedidos} = this.state
    if(pedidos && pedidos[0].enEspera){
      if(!this.timer){
        console.log("Activando el reloj")
        this.timer = setInterval( this.alContar , 1000)
      }
    } else {
      this.detenerReloj()
    }
  }

  detenerReloj(){
    console.log("Desactivando el reloj")
    clearInterval(this.timer)
    this.timer = null
  }

  componentDidMount() {
    const cliente = this.props.id
    Usuario.observar(cliente)
    Pedido.observar(pedido => pedido.enPedido(cliente))
    Plato.observar(plato => plato.activo)
    this.activarReloj()
  }

  componentWillUnmount(){
    const { usuario } = this.state
    usuario && usuario.detener()
    Plato.detener()
    Pedido.detener()
    this.detenerReloj()
  }

  render(){
    const {usuario, platos, pedidos}  = this.state

    console.log(    "hayUsuario ", !!usuario)
    console.log(    "hayPlatos  ", !!platos,  platos  && platos.length)
    console.log(    "hayPedidos ", !!pedidos, pedidos && pedidos.length, pedidos && pedidos[0])
    console.log("Pantalla", Pantalla.pagina )

    const hayDatos   = usuario && platos && pedidos
    const hayPlatos  = platos  && platos.length  > 0
    const hayPedidos = platos  && pedidos && pedidos.length > 0

    if(hayPedidos){
      var pedido = pedidos[0]
      var plato  = platos.find(plato => plato.id === pedido.plato)

      return <PaginaSeguimiento {...this.props}
                  usuario={usuario}
                  pedido={pedido}
                  plato={plato}
                  alCancelar ={ () => pedido.cancelar() }
                  alValorar  ={ valoracion => pedido.valorar(valoracion) } />
    }

    if(hayPlatos){

      return <RealizarPedido {...this.props}
                  usuario={usuario}
                  platos={platos}
                  alElegir={ plato => Pedido.pedir(usuario, plato) } />
    }

    return <Cargando />
  }
}

class RealizarPedido extends Component {
  render(){
    const { platos, alElegir, alSalir, usuario } = this.props
    console.log("REALIZAR_PEDIDO","Pantalla.pagina", Pantalla.pagina)
    return (
      <Container>
        <Header>
          <Title>Realizar pedido</Title>
          <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
        </Header>
        <Content>
          <IndicatorViewPager
              style={Pantalla.pagina}
              indicator={ this.generarPuntos(platos.length+1) }>
            <View><PaginaPresentacion /></View>
            {platos.map( (plato, indice) => <View key={indice}><PaginaProducto plato={plato} alElegir={() => alElegir(plato)}/></View> )}
          </IndicatorViewPager>
        </Content>
      </Container>
    )
  }

  generarPuntos(paginas){
    return <PagerDotIndicator pageCount={paginas} style={{bottom:80}}/>
  }

}

class Paginador extends Component {
  render(){
      const {paginas} = this.props
      return <PagerDotIndicator pageCount={paginas} style={{bottom:80}}/>
  }
}

class PaginaPresentacion extends Component {
  render(){
    return (
      <View style={Pantalla.contenido}>
        <View style={{height: 140, backgroundColor: 'powderblue'}} />
        <View style={{flex: 1, backgroundColor: 'skyblue', alignItems: 'center'}}>
          <Text style={{fontSize:30, marginTop:20, height:100,color:'red'}}>El plato del dia</Text>
        </View>
        <View style={{height: 50, backgroundColor: 'steelblue', alignItems:'center'}}>
          <Text style={{fontSize: 20}}>Tu plato en 30 minutos o gratis</Text>
         </View>
      </View>
    )
  }
}

class PaginaProducto extends Component {
  render(){
    const {plato, alElegir} = this.props
    return (
      <View style={Pantalla.contenido}>
        <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)} >
          <Precio precio={plato.precio} />
        </Image>
        <View style={{marginTop: Pantalla.separacion}}>
            <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
            <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
        </View>
        <Button onPress={() => alElegir()} style={Pantalla.accion}> ¡Pedir Ya! </Button>
      </View>
    )
  }
}

const Precio = ({precio}) => (
  <View style={Estilo.plato.ubicarPrecio}>
    <Text style={Estilo.plato.precio}>u$s{precio}</Text>
  </View>
)

const Accion = (props) => {
  switch (props.pedido.estado) {
    case Estados.pedido:
        return (<Button block style={Pantalla.accion} onPress={ () => props.alCancelar( props.pedido) }>
                   <Icon name='ios-close-circle' /> Cancelar!
                </Button>)
    case Estados.retirado:
        return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Esta en camino. Salio {humanizeHora(30*60-props.pedido.demora)}</Text>)
    case Estados.entregado:
        return (<StarRating style={Pantalla.accion} rating={props.pedido.valoracion} selectedStar={ valoracion => props.alValorar(valoracion)} />)
    case Estados.cancelado:
        return false
    default:
        return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Esperando... {humanizeHora(30*60-props.pedido.demora)}</Text>)
  }
}

class Pago extends Component {
  render(){
    const {demora, precio} = this.props
    const esTarde = demora > EsperaMaxima
    const total   = esTarde ? `Hoy comes GRATIS` : `Total a pagar $${precio}`
    const detalle = esTarde ? 'Lo sentimos... no llegamos a tiempo' : `Si demoramos más de ${humanizeHora(EsperaMaxima - demora)} es GRATIS`
    const color   = esTarde ? 'red' : 'blue'
    return (
      <CardItem style={{alignItems:'center'}}>
        <Text style={{fontSize: 24, color, fontWeight: 'bold', marginTop:10}}>{total}</Text>
        <Text style={{fontSize: 10, color: 'gray'}}>{detalle}</Text>
      </CardItem>
    )
  }
}

class PaginaSeguimiento extends Component {
  render(){
    const { pedido, plato,  alCancelar, alValorar, alSalir, usuario } = this.props
    const { cadete, estado, cliente } = pedido
    return (
      <Container>
          <Header>
            <Title>Seguimiento ({usuario.id})</Title>
            <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>
          </Header>
        <Content>
          <View style={Pantalla.contenido}>
            <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)}>
              <Precio precio={plato.precio} />
            </Image>
            <View style={{marginTop: Pantalla.separacion}}>
                <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
                <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
            </View>
            <Accion {...this.props} pedido={pedido} />
          </View>
        </Content>
      </Container>
    )
  }
}

class SeguirPedido extends Component {
  render(){
    const { pedido, plato,  alCancelar, alValorar, alSalir, usuario } = this.props
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
                <Text style={Estilo.plato.descripcion}>  {plato.descripcion} </Text>
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
          <Accion {...this.props} pedido={pedido} />
        </Footer>
      </Container>
    )
  }
}

const Cargando = (props) => <View style={{flex:1, alignItems: 'stretch'}}><Spinner style={{flex:1}} color={"red"} /></View>

console.log("IMPORT: Cliente v.2")
