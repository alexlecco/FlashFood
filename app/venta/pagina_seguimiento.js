'use strict';

import React, { Component } from 'react';
import { Image, Platform } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon,
  Grid, Col, Row,
} from 'native-base';

import StarRating from 'react-native-star-rating';
import { Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';
import { MostrarPlato } from './Plato';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24

  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

const esCompacto = (Platform) => {
  return Platform.OS == 'ios' ? false : true
}

const Accion = ({pedido}) => {
  switch (pedido.estado) {
    case Estados.pedido:
        return (<Button block danger style={Pantalla.accion} onPress={ () => pedido.cancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>)
    case Estados.entregado:
        return (<Button block disabled={!pedido.valoracion} style={Pantalla.accion} onPress={ () => pedido.valorar() }><Icon name='ios-checkmark' />Valorar!</Button>);
    default:
        return null;
  }
}

const Mostrar = ({texto, demora, faltante, completo}) => {
  const mensajeRapido = completo ? "Misión cumplida. Nos sobró "+humanizeHora(faltante) : "Te lo entregamos en "+humanizeHora(faltante)
  const mensajeLento  = (completo ? "Fallamos por " + humanizeHora(-faltante) : "Estamos " + humanizeHora(-faltante) +" atrazados") + " pero..."
  const ofertaRapido  = completo ? "" : "o comes gratis"
  const ofertaLento   = "¡HOY " + (completo ? "COMISTE" : "COMES") +" GRATIS!"
  return (
    <View style={{position:'absolute', bottom: 150, left:20, right: 20}}>
      <Text style={{fontSize: 20}}>{texto} {humanizeHora(demora)}</Text>
      <Text style={{color: 'red'}}>{faltante > 0 ? mensajeRapido : mensajeLento}</Text>
      <Text>{faltante > 0 ? ofertaRapido : ofertaLento}</Text>
    </View>
  )
}

const Estado = ({pedido}) => {
  switch (pedido.estado) {
    case Estados.pendiente:
        return <Mostrar texto={"Pedido en curso"} demora={null} faltante={pedido.tiempoFaltante} />

    case Estados.pedido:
        return <Mostrar texto={"Pedido realizado hace"} demora={pedido.tiempoPedido} faltante={pedido.tiempoFaltante} />

    case Estados.aceptado:
        return <Mostrar texto={"Plato en la cocina"} demora={pedido.tiempoCoccion} faltante={pedido.tiempoFaltante} />

    case Estados.entregado:
        return (
            <View>
              <Mostrar texto="Plato entregado hace " demora={pedido.tiempoValoracion} faltante={pedido.tiempoFaltante} completo={true}/>
              <View style={{position:'absolute', bottom: 100, left:20, right: 20}}>
                <StarRating rating={pedido.valoracion} selectedStar={ valoracion => pedido.ponerValoracion(valoracion)} />
              </View>
            </View>
        )

    case Estados.recibido:
        return <Mostrar texto={"Plato entregado"} demora={pedido.tiempoPedido} faltante={pedido.tiempoFaltante} />

    default:
        return (
          <View style={{position:'absolute', bottom: 100, left:20, right: 20}}>
              <Text style={{fontSize: 20}}>ESTADO: {pedido.estado}</Text>
              <Text style={{fontSize: 20}}> ⏳ PEDIDO   : {humanizeHora(pedido.tiempoPedido)}</Text>
              <Text style={{fontSize: 20}}> ⏳ ACEPTADO : {humanizeHora(pedido.tiempoCoccion)}</Text>
              <Text style={{fontSize: 20}}> ⏳ ENTREGADO: {humanizeHora(pedido.tiempoFaltante)}</Text>
           </View>
      )
  }
}

class PaginaSeguimiento extends Component {
  render(){
    const { pedido, plato, alSalir, usuario } = this.props
    const { cadete, estado, cliente } = pedido
    return (
      <Pagina titulo="Seguimiento.3" alSalir={() => alSalir() }>
        <Contenido>
          <MostrarPlato plato={plato} compacto={esCompacto(Platform)} />
          <Estado {...this.props} />
          <Accion {...this.props} />
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaSeguimiento }
