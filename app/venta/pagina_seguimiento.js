'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon,
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

const Precio = ({precio}) =>
  <View style={Estilo.plato.ubicarPrecio}>
    <Text style={Estilo.plato.precio}>u$s{precio}</Text>
  </View>

const Accion = (props) => {
  switch (props.pedido.estado) {
    case Estados.pedido:
        return (<Button block style={Pantalla.accion} onPress={ () => props.alCancelar( props.pedido) }>
                   <Icon name='ios-close-circle' /> Cancelar!
                </Button>)
    case Estados.retirado:
        return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Está en camino. Salio {humanizeHora(30*60-props.pedido.demora)}</Text>)
    case Estados.entregado:
        return (<StarRating style={Pantalla.accion} rating={props.pedido.valoracion} selectedStar={ valoracion => props.alValorar(valoracion)} />)
    case Estados.cancelado:
        return false
    default:
        return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Esperando... {humanizeHora(30*60-props.pedido.demora)}</Text>)
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

export { PaginaSeguimiento }
