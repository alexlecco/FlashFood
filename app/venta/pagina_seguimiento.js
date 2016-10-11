'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon,
} from 'native-base';

import StarRating from 'react-native-star-rating';
import { Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

const Precio = ({precio}) =>
  <View >
    <Text style={[Estilo.plato.precio, Estilo.plato.ubicarPrecio]}>u$s{precio}</Text>
  </View>

  const Accion = ({pedido}) => {
    switch (pedido.estado) {
      case Estados.pedido:
          return (<Button block style={Pantalla.accion} onPress={ () => pedido.cancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>);
      case Estados.retirado:
          return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Está en camino. Salio {humanizeHora(30*60-pedido.demora)}</Text>);
      case Estados.entregado:
          return (
            <View>
              <StarRating style={Pantalla.accion} rating={pedido.valoracion} selectedStar={ valoracion => pedido.valoracion(valoracion)} />
              <Button block style={Pantalla.accion} onPress={ () => pedido.valorar() }><Icon name='ios-close-circle' />Valorar!</Button>
            </View>
          );
      case Estados.cancelado:
          return null;
      default:
          return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Esperando... {humanizeHora(30*60-props.pedido.demora)}</Text>);
    }
  }

class PaginaSeguimiento extends Component {
  render(){
    const { pedido, plato, alSalir, usuario } = this.props
    const { cadete, estado, cliente } = pedido
    return (
      <Pagina titulo="Seguimiento 2" alSalir={() => alSalir() }>
        <Contenido>
          <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)}>
            <Precio precio={plato.precio} />
          </Image>
          <View style={{marginTop: Pantalla.separacion}}>
              <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
              <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
          </View>
          <Accion {...this.props} />
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaSeguimiento }
