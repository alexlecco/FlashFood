'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import { Container, Header, Title, Content, Footer, Button, Text, View, Spinner, Icon } from 'native-base';

import StarRating from 'react-native-star-rating';
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

import { Paginas, Pagina, Contenido } from './../componentes/pagina';

// import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

const humanizeHora = (segundos) => {
  segundos = Math.floor(segundos)
  const s = segundos % 60
  const m = ((segundos - s) / 60 ) % 60
  const h = ((segundos - s - m * 60)/(60*60)) % 24
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`
}

class PlatoCompacto extends Component {
  render(){
    const {plato} = this.props;
    return (
      <View style={{flexDirection:'row'}}>
        <Image source={{uri: plato.foto}} style={[Pantalla.imagen(4/3, 0.4), {borderRadius: 5,}]}>
          <Precio precio={plato.precio} compacto={true} />
        </Image>
        <View style={{marginLeft: Pantalla.separacion, flex: 1}}>
          <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
          <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
        </View>
      </View>
    )
  }
}

class PlatoNormal extends Component {
  render(){
    const { plato } = this.props;
    return (
      <View>
        <Image source={{uri: plato.foto}} style={[Pantalla.imagen(4/3), {borderRadius: 5, }]}>
          <Precio precio={plato.precio} />
        </Image>
        <View style={{marginTop: Pantalla.separacion}}>
          <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
          <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
        </View>
      </View>
    )
  }
}

const Precio = ({ precio, compacto }) =>
  <View style={Estilo.plato.ubicarPrecio}>
    <Text style={compacto ? Estilo.plato.precioCompacto : Estilo.plato.precio}>${precio}</Text>
  </View>

const MostrarPlato = ({plato, compacto}) => compacto ? <PlatoCompacto plato={plato} /> : <PlatoNormal plato={plato} />

export { PlatoCompacto, PlatoNormal, MostrarPlato }
