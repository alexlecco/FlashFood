'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import { Container, Header, Title, Content, Footer, Button, Text, View, Spinner, Icon, } from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';
import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { PaginaConfirmar } from './pagina_confirmar';
import { PaginaSeguimiento } from './pagina_seguimiento';
import { PaginaPedido } from './pagina_pedido';
import { Pedir } from './Pedir';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

class Cliente extends Component {
  constructor(props){
    super(props)
    this.state = { usuario: false, platos: false, pedidos: false}
    console.log("CONSTRUCTOR EN CLIENTE")

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
    // if(pedidos && pedidos[0].enEspera){
      if(!this.timer){
        console.log("Activando el reloj")
        this.timer = setInterval( this.alContar , 1000)
      }
    // } else {
    //   this.detenerReloj()
    // }
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

    const hayDatos   = usuario && platos && pedidos
    const hayPlatos  = platos  && platos.length  > 0
    const hayPedidos = platos  && pedidos && pedidos.length > 0

    if(hayPedidos){
      var pedido = pedidos[0]
      var plato  = platos.find(plato => plato.id === pedido.plato)

      // return <Pedir platos={platos} />
      if(pedido.estado === Estados.pendiente ){
        return <PaginaConfirmar {...this.props}
                  usuario={usuario}
                  pedido={pedido}
                  plato={plato}
                  alConfirmar ={ () => pedido.confirmar() }
                  alCancelar ={ () => pedido.cancelar() } />
      } else {
        return <PaginaSeguimiento {...this.props}
                  usuario={usuario}
                  pedido={pedido}
                  plato={plato} />
      }
    }

    if(hayPlatos){

      return <PaginaPedido {...this.props}
                  usuario={usuario}
                  platos={platos}
                  alElegir={ plato => Pedido.pedir(usuario, plato) } />
    }

    return <Cargando />
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
      <View style={{alignItems:'center'}}>
        <Text style={{fontSize: 24, color, fontWeight: 'bold', marginTop:10}}>{total}</Text>
        <Text style={{fontSize: 10, color: 'gray'}}>{detalle}</Text>
      </View>
    )
  }
}

console.log("IMPORT: Cliente v.3")

export { Cliente }
