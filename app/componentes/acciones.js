'use strict';

import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'native-base';

import { Pantalla } from './../pantalla';

export default class Acciones extends Component {
  
  ubicar(i){
    const m = Pantalla.margen, s = Pantalla.separacion / 2
    const primero = i == 0
    const ultimo  = i == this.props.titulos.length - 1
    return  {marginTop:m, marginBottom: m, marginLeft: primero ? m : s, marginRight: ultimo ? m : s}
  }

  render(){
    const {titulos, alElegir} = this.props
    return (
       <Grid>
         {titulos.map( (titulo, index) => (
           <Col key={index}>
              <Button block style={this.ubicar(index)} onPress={() => alElegir(index)}>{titulo}</Button>
            </Col>
          )
         )}
       </Grid>
     )
   }
}
