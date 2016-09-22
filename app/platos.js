'use strict';

import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import {
  Container, Header, Title, Content,
  Grid, Row, Col,
  List, ListItem,
  Thumbnail,
  Button,
  Card, CardItem,
} from 'native-base';

export default class Platos extends Component {

  extraerPlatos(platos){
    const URL = 'https://dl.dropboxusercontent.com/u/1086383/platos/'

    const  lista = Object.keys(platos).map( codigo => {
        const { descripcion, precio } = platos[codigo]
        return {
          codigo,
          descripcion,
          precio,
          foto:        `${URL}${codigo}.jpg`,
          detalle:     `Larga descripción de ${descripcion}  bla bla bla bla bla bla bla bla bla bla bla bla`,
        }
      }
    )
    return lista.sort((a, b) => a.precio > b.precio)
  }

  render(){
    const { title, onBack, platos } = this.props;

    if(platos == null) { return (
      <Container>
        <Header>
          <Button transparent onPress={onBack}>Volver</Button>
          <Title>Cargando...</Title>
        </Header>
        <Content>
          <Text>🤔</Text>
        </Content>
      </Container>
    ) };

    const lista = this.extraerPlatos(platos)
    console.log("PLATOS\n",lista)

    return (
      <Container>
        <Header>
          <Button transparent onPress={onBack}>Volver</Button>
          <Title>Platos</Title>
        </Header>
        <Content>
          <List dataArray={lista}
                renderRow={(plato) =>
                  <ListItem>
                    <Card>
                      <CardItem>
                        <Image source={{uri: plato.foto}} style={{resizeMode: 'cover'}} />
                      </CardItem>
                      <CardItem style={{height: 110}}>
                        <Grid>
                          <Col size={3} style={{marginRight: 10}} >
                            <Text style={{fontSize:20, fontWeight:'bold'}}>{plato.descripcion}</Text>
                            <Text note>{plato.detalle}</Text>
                          </Col>
                          <Col size={1}>
                            <Row><Text style={{fontSize:40, textAlign:'center'}}>${plato.precio}</Text></Row>
                            <Row><Button primary style={{marginTop: 5}}> Comprar </Button></Row>
                          </Col>
                        </Grid>
                      </CardItem>
                    </Card>
                  </ListItem>
                }>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = require('./styles.js')
