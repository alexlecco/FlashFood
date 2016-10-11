'use strict';

import React, { Component } from 'react';
import { Image } from 'react-native';

import {
  Container, Header, Title, Content,
  Button, Text, View,
  Icon,
  List, ListItem, Radio,
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

class PaginaConfirmar extends Component {
  render(){
    const { pedido, plato,  alCancelar, alConfirmar, alSalir, usuario, lugar } = this.props
    const { cadete, estado, cliente } = pedido
    console.log("PaginasConfirmar", typeof(pedido), pedido.entregarEn)
    return (
      <Pagina titulo="Confirmar" alSalir={() => alSalir() }>
        <Contenido>
          <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)}>
            <Precio precio={plato.precio} />
          </Image>
          <View style={{marginTop: Pantalla.separacion}}>
              <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
              <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
              <List>
                <ListItem>
                  <Text> ¿Dónde queres comer? </Text>
                </ListItem>
                <ListItem >
                    <Radio selected={ pedido.lugar === "oficina" } onPress={ () => pedido.entregarEn(pedido.lugar === "oficina" ? null : "oficina") } />
                    <Text>En la oficina</Text>
                </ListItem>
                <ListItem>
                    <Radio selected={ pedido.lugar === "bar" } onPress={ () => pedido.entregarEn(pedido.lugar === "bar" ? null : "bar") } />
                    <Text>En el bar</Text>
                </ListItem>
              </List>

          </View>
          <Button block style={Pantalla.accion1} onPress={ () => alCancelar() }><Icon name='ios-close-circle' /> Cancelar!</Button>
          <Button block disabled={!pedido.lugar} style={Pantalla.accion2} onPress={ () => alConfirmar() }><Icon name='ios-checkmark' /> Confirmar!</Button>
        </Contenido>
      </Pagina>
    )
  }
}

export { PaginaConfirmar }
