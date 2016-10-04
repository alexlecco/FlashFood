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
  <View style={Estilo.plato.ubicarPrecio}>
    <Text style={Estilo.plato.precio}>u$s{precio}</Text>
  </View>

const Accion = (props) => {
  switch (props.pedido.estado) {
    case Estados.pedido:
        return (<Button block style={Pantalla.accion} onPress={ () => props.alCancelar( props.pedido) }><Icon name='ios-close-circle' /> Cancelar!</Button>);
    case Estados.retirado:
        return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Está en camino. Salio {humanizeHora(30*60-props.pedido.demora)}</Text>);
    case Estados.entregado:
        return (<StarRating style={Pantalla.accion} rating={props.pedido.valoracion} selectedStar={ valoracion => props.alValorar(valoracion)} />);
    case Estados.cancelado:
        return null;
    default:
        return (<Text style={[Pantalla.accion, {fontSize: 20}]}>Esperando... {humanizeHora(30*60-props.pedido.demora)}</Text>);
  }
}

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
                    <Radio selected={ pedido.lugar === "oficina" } onPress={ () => pedido.entregarEn("oficina") } />
                    <Text>En la oficina</Text>
                </ListItem>
                <ListItem>
                    <Radio selected={ pedido.lugar === "bar" } onPress={ () => pedido.entregarEn("bar") } />
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
