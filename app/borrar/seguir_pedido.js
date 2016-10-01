'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content, Footer,
  Card, CardItem,
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

export { SeguirPedido }
