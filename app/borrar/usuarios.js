'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content,
  Grid, Row, Col,
  List, ListItem,
  Card, CardItem,
  Thumbnail,
  Button, Text, View,
  Tabs,
} from 'native-base';
import styles from './styles';

export default class Usuarios extends Component {

  constructor (props){
    super(props)

    this.state = { tipo: 'cocinero', }
  }

  extraerUsuarios(usuarios, tipo){
    const URL = 'https://dl.dropboxusercontent.com/u/1086383/usuarios/'
    var lista = Object.keys(usuarios).map( codigo => {
        const usuario = usuarios[codigo]
        return {
            ...usuario,
            codigo,
          foto: `${URL}${codigo}.jpg`,
        }
      }
    )
    // const lista1 = lista.filter((u) => u.tipo === tipo)
    // const lista2 = lista1.sort( (a, b) => a.nombre > b.nombre )
    return  lista //.sort((a, b) => a.nombre > b.nombre)
  }

  render(){
    const { title, onBack, usuarios, onElegir } = this.props;

    if(usuarios == null) {
      return (
      <Container>
        <Header>
          <Button transparent onPress={onBack}>Volver</Button>
          <Title>Cargando...2</Title>
        </Header>
        <Content>
          <Text>🤔</Text>
        </Content>
      </Container>
    ) };


    return (
      <Container>
      <Header>
        <Button transparent onPress={onBack}>Volver</Button>
        <Title>Usuarios</Title>
      </Header>
        <Content>
            <Listado tabLabel="Clientes" datos={this.extraerUsuarios(usuarios, "clientes")}></Listado>
        </Content>
      </Container>
    );
  }
}

const Listado = (props) => {
  const {datos} = props
  return (
    <List dataArray={datos}
      renderRow={(usuario) =>
        <ListItem>
          <Card>
            <CardItem style={{height: 110}}>
              <Grid>
                <Col style={{marginRight: 10, justifyContent: 'center'}} size={1} >
                  <Thumbnail source={{uri: usuario.foto}} size={65} />
                </Col>
                <Col style={{marginRight: 10}} size={3} >
                  <Row>
                    <Text style={{fontSize:20, fontWeight:'bold'}}>{usuario.nombre}</Text>
                  </Row>
                  <Row>
                    <Text style={{fontSize:15}}>{usuario.domicilio}</Text>
                  </Row>
                  <Row>
                    <Col><Text note>{usuario.tipo}</Text></Col>
                    <Col><Button primary style={{marginTop: 5, flex:1}} onPress={onElegir} > Ingresar </Button></Col>
                  </Row>
                </Col>
              </Grid>
            </CardItem>
          </Card>
        </ListItem>
      }>
    </List>)
}
