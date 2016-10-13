'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import { Container, Header, Title, Content, Footer, Button, Text, View, Spinner, Icon } from 'native-base';

import StarRating from 'react-native-star-rating';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Paginas, Pagina, Contenido } from './../componentes/pagina';

import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

import { MostrarPlato } from './Plato';

class PaginaPedido extends Component {
  render(){
    const { platos, alElegir, alSalir, usuario, presentacion } = this.props
    return (
      <Pagina titulo={"Realizar Pedidos"} alSalir={() => alSalir() }>
        <IndicatorViewPager style={Pantalla.pagina} indicator={ this.generarPuntos(platos.length + presentacion ? 1 : 0) }>
          {!!presentacion &&<View><PaginaPresentacion /></View>}
          {platos.map( (plato, indice) => <View key={indice}><PaginaProducto plato={plato} alElegir={ () => alElegir(plato) }/></View> )}
        </IndicatorViewPager>
      </Pagina>
    )
  }

  generarPuntos(paginas){
    return <PagerDotIndicator pageCount={paginas} style={{bottom:80}}/>
  }
}

class PaginaPresentacion extends Component {
  render(){
    return (
      <Contenido>
        <View style={{height: 140, backgroundColor: 'powderblue'}} />
        <View style={{flex: 1, backgroundColor: 'skyblue', alignItems: 'center'}}>
          <Text style={{fontSize:30, marginTop:20, height:100,color:'red'}}>El plato del dia</Text>
        </View>
        <View style={{height: 50, backgroundColor: 'steelblue', alignItems:'center'}}>
          <Text style={{fontSize: 20}}>Tu plato en 30 minutos o gratis</Text>
         </View>
      </Contenido>
    )
  }
}

class PaginaProducto extends Component {
  render(){
    const { plato, alElegir } = this.props;
    return (
      <Contenido>
        <MostrarPlato plato={plato} />
        <Button onPress={() => alElegir()} style={Pantalla.accion}> ¡Pedir Ya! </Button>
      </Contenido>
    )
  }
}

export { PaginaPedido }
