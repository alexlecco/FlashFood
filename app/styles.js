'use strict';

const React = require('react-native')
const { StyleSheet } = React


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  contador: {
    fontSize: 100,
    textAlign: 'center',
    margin: 10,
  },
  accion: {
		fontSize: 40,
    textAlign: 'center',
    marginBottom: 5,
		padding: 10,
		borderWidth: 1,
		borderColor: 'red',
		paddingHorizontal: 40,
		borderRadius: 10,
		overflow:'hidden',
		backgroundColor: 'red',
		color: 'yellow',
  },
  titulo: {
    fontSize: 40,
    textAlign: 'center',
		color: 'green',
  },

  usuario_nombre: {
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'stretch',
    height: 30
  },

  usuario_id: {
    fontSize: 14,
    fontWeight: '100',
  },

  plato_descripcion:  {
    fontSize:20,
    fontWeight:'bold',
    height: 25,
  },

  plato_detalle:  {
    fontSize:12,
    height: 40,
  },

  plato_precio: {
    fontSize: 40,
    fontWeight: 'normal',
    height: 50,
    paddingTop: 30,
  },

  plato_imagen: {
    width: 240,
    height: 180,
  },

  plato_estado: {
    fontSize: 30,
    textAlign:'center',
    color:'green',
    height: 50,
  },

  pedido_descripcion: {
    fontSize: 10,
    color: 'gray',
  },

  pedido_cantidad: {
    fontSize: 15,
    color: 'blue',
    fontWeight: 'bold',
  },

});

module.exports = styles
