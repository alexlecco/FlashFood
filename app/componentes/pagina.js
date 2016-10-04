import React, { Component } from 'react';

import { Container, Header, Title, Content, Button, View, Icon, Spinner } from 'native-base';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Pantalla } from './../styles';

const Pagina = ({titulo, alSalir, children}) =>
  <Container>
      <Header>
        <Title>{titulo}</Title>
        {!!alSalir && <Button transparent onPress={ () => alSalir() } ><Icon name='ios-home' /></Button>}
      </Header>
    <Content>
      <View style={Pantalla.pagina}>{children}</View>
    </Content>
  </Container>

const Contenido = ({children}) =>
  <View style={Pantalla.contenido}>{children}</View>

const Cargando = ({color}) =>
  <View style={{flex:1, alignItems: 'stretch'}}>
    <Spinner style={{flex:1}} color={color} />
  </View>

export { Pagina, Contenido, Cargando}
