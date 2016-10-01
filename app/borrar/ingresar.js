import React, { Component } from 'react';

import { Container, Header, Title, Content, Button, Text, View, Grid, Row, Col } from 'native-base';
import styles from './styles';

export default function Ingresar(props) {
  const { title, onVerPlatos, onVerUsuarios } = props
  const botones = { width: 140, margin: 10 }
  return  (
    <Container>
      <Header>
        <Title>{title}v0.4</Title>
      </Header>
      <Content>
        <View style={{justifyContent: 'center'}}>
            <Text>Listados</Text>
            <Button style={botones} onPress={onVerPlatos}>   Platos   </Button>
            <Button style={botones} onPress={onVerUsuarios}> Usuarios </Button>
        </View>
      </Content>
    </Container>
  );
}
