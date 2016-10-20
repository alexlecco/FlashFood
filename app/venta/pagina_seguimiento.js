'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

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

const Accion = ({pedido}) => {
  switch (pedido.estado) {
    case Estados.pedido:
        return <Button block style={Pantalla.accion} onPress={ () => pedido.cancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>;
    case Estados.entregado:
        return <Button block style={Pantalla.accion} onPress={ () => pedido.valorar() }><Icon name='ios-close-circle' />Valorar!</Button>;
    default:
        return null;
  }
}

const Estado = ({pedido}) => {
  switch (pedido.estado) {
    case Estados.retirado:
        return <Text style={[Pantalla.accion, {fontSize: 20}]}>Está en camino. Salio {humanizeHora(30*60-pedido.demora)}</Text>;
    case Estados.entregado:
        return <StarRating rating={pedido.valoracionActual()} selectedStar={ valoracion => pedido.valoracion(valoracion)} />;
    default:
        return null;
  }
}

class PaginaSeguimiento extends Component {
  render(){
    const { pedido, plato, alSalir, usuario } = this.props
    const { cadete, estado, cliente } = pedido
    return (
      <Pagina titulo="Seguimiento 2" alSalir={() => alSalir() }>
        <Contenido>
          <MostrarPlato plato={plato} compacto={false} />
          <View style={{position:'absolute',bottom:100,left:20,right:20}}>
          <Estado {...this.props} />
          </View>
          <Accion {...this.props} />
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaSeguimiento }
