'use strict';

import React, {StyleSheet} from 'react-native';

import { Pantalla } from './pantalla';
console.log("STYLE > Pantalla:", Pantalla)

const Estilos = StyleSheet.create({

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

});

const Plato = StyleSheet.create({
  ubicarPrecio: {
    position: 'absolute',
    right:  Pantalla.separacion,
    bottom: Pantalla.separacion,
    width: 120,
    height: 40,
    alignSelf: 'center',
  },

  precio: {
    backgroundColor: 'yellow',
    opacity: 0.6,
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 5,
    padding: 5,
  },

  precioCompacto: {
    backgroundColor: 'yellow',
    opacity: 0.6,
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 10,
  },

  imagen: {
    width: 240,
    height: 180,
  },

  estado: {
    fontSize: 30,
    textAlign:'center',
    color:'green',
    height: 50,
  },

  descripcion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  detalle: {
    fontSize: 12,
    color: 'gray',
  },

  cantidad: {
    fontSize: 15,
    color: 'blue',
    fontWeight: 'bold',
  },
});

const Pedido = StyleSheet.create({
  descripcion: {
    fontSize: 10,
    color: 'gray',
  },

  cantidad: {
    fontSize: 15,
    color: 'blue',
    fontWeight: 'bold',
  },
});

const Item = StyleSheet.create({
  centrar: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  }
});

const Usuario = StyleSheet.create({
  id: {
    fontSize: 14,
    fontWeight: '100',
  },

  nombre: {
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'stretch',
    height: 30
  },
});

const Estilo = {plato: Plato, pedido: Pedido, usuario: Usuario};
export {Estilos, Estilo, Pantalla, Item};
