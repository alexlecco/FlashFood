'use strict';

import React, { Component } from 'react';
import { Image, } from 'react-native';

import { Container, Header, Title, Content, Grid, Col, Row, List, ListItem, Card, CardItem, Button, Text, View, Spinner, Icon, Thumbnail, } from 'native-base';

import { Pagina, Contenido, Cargando } from './../componentes/pagina';

import { Usuario, Pedido, Plato, Estados } from './../datos'
import { Estilos, Estilo, Pantalla } from './../styles';

class Cadete extends Component {
    constructor(props){
      super(props)

      this.state = { usuario: false, platos: false, pedidos: false }
      Usuario.registrar(this)
      Plato.registrar(this)
      Pedido.registrar(this)
    }

    componentDidMount() {
      const cadete = this.props.id
      Usuario.observar(cadete)
      Usuario.observar(usuario => usuario.esCliente || usuario.esCocinero )

      Plato.observar( plato => plato.activo )
      Pedido.observar( pedido => pedido.enEntrega(cadete) )
    }

    componentWillUnmount(){
      const cadete = this.props.id
      Usuario.detener(cadete)
      Usuario.detener()

      Plato.detener()
      Pedido.detener()
    }

    alElegir = (pedido) => {
      const cadete = this.props.id
      if(pedido.estado == Estados.disponible){
        pedido.retirar(cadete)
      } else {
        pedido.entregar()
      }
    }

    render(){
      const cadete = this.props.id

      const {usuario, platos, pedidos, usuarios}  = this.state
      const hayDatos  = usuario && platos && pedidos

      if(!hayDatos) { return <Cargando /> }

      const pedido  = pedidos[0]
      if(!pedido){ return <Libre {...this.props} />}

      const plato    = platos.find(plato => plato.id === pedido.plato)
      const cocinero = usuarios.find(usuario => usuario.id === pedido.cocinero)
      const cliente  = usuarios.find(usuario => usuario.id === pedido.cliente)

      return <Envio {...this.props} pedido={pedido} plato={plato} cocinero={cocinero} cliente={cliente} alElegir={ this.alElegir } />
    }
  }

  const Envio = (props) => {
    const { pedido, plato, cliente, cocinero, alElegir, alSalir } = props
    const accion = pedido.estado === Estados.disponible ? 'Retirar ya!' : 'Entregar ya!'

    return (
      <Pagina titulo={"Envio"} alSalir={() => alSalir()}>
      <Contenido>
        <Image source={{uri: plato.foto}} style={Pantalla.imagen(4/3)}>
          <Precio precio={plato.precio} />
        </Image>
        <View style={{marginTop: Pantalla.separacion}}>
          <Text style={Estilo.plato.descripcion}> {plato.descripcion} </Text>
          <Text style={Estilo.plato.detalle}> {plato.detalle} </Text>
          {pedido.estado === Estados.disponible && <Cocinero {...props} />}
          {pedido.estado === Estados.retirado   && <Cliente  {...props} />}
        </View>
        <Button block style={Pantalla.accion} onPress={ () => alElegir(pedido) }><Text>{accion}</Text></Button>
        </Contenido>
      </Pagina>
    )
  }

  const Precio = ({precio}) =>
    <View >
      <Text style={[Estilo.plato.precio, Estilo.plato.ubicarPrecio]}>${precio}</Text>
    </View>

  const Cocinero = ({pedido, cocinero}) =>
    <Grid>
      <Col><Thumbnail source={{uri: cocinero.foto}} size={100} /></Col>
      <Col>
        <Text style={Estilo.pedido.descripcion}> Cocinero: </Text>
        <Text style={Estilo.pedido.cantidad}>{cocinero.nombre}</Text>
        <Text style={Estilo.pedido.descripcion}> Dirección: </Text>
        <Text style={Estilo.pedido.cantidad}>{cocinero.domicilio}</Text>
      </Col>
    </Grid>

  const Cliente = ({pedido, cliente}) =>
    <Grid>
      <Col><Thumbnail source={{uri: cliente.foto}} size={100} /></Col>
      <Col>
        <Text style={Estilo.pedido.descripcion}> Cliente: </Text>
        <Text style={Estilo.pedido.cantidad}>{cliente.nombre}</Text>
        <Text style={Estilo.pedido.descripcion}> Dirección: </Text>
        <Text style={Estilo.pedido.cantidad}>{cliente.domicilio}</Text>
      </Col>
    </Grid>



  const Libre = (props) =>
    <Pagina titulo={"Envio"} alSalir={() => props.alSalir()}>
      <Text style={{fontSize: 20, alignSelf: 'center'}}>No hay pedidos</Text>
    </Pagina>

export { Cadete };
