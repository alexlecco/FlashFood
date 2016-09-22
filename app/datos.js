'use strict';

import * as firebase from 'firebase';

const dbconfig = {
  apiKey:        "AIzaSyDmlK4hhVVk9TxQT8W9RHtKdIwd5Cs12zY",
  authDomain:    "contador-903c2.firebaseapp.com",
  databaseURL:   "https://contador-903c2.firebaseio.com",
  storageBucket: "contador-903c2.appspot.com",
};

export const Estados = {
  pedido:     'pedido',
  aceptado:   'aceptado',
  disponible: 'disponible',
  retirado:   'retirado',
  entregado:  'entregado',
  recibido:   'recibido',

  cancelado:  'cancelado',
}

const SiguienteEstado = {
  pedido:     'aceptado',
  aceptado:   'disponible',
  disponible: 'retirado',
  retirado:   'entregado',
  entregado:  'recibido',
}

export const proximoEstado = estado => SiguienteEstado[estado];

const base = firebase.initializeApp(dbconfig);
const raiz = base.database().ref()

const values = objeto => Object.keys(objeto || []).map(clave => objeto[clave])

const Plurales   = [ [/ci[oÃ³]n$/, 'ciones'], [/z$/, 'ces'], [/([aeiou])$/, '$1s'],]
const Singulares = [ [/nes$/, 'n'], [/ces$/, 'z'], [/([aeiou])s$/, '$1'],]

String.prototype.plural   = function() { return Plurales.reduce( (tmp, x) => tmp.replace(x[0], x[1]), this) }
String.prototype.singular = function() { return Singulares.reduce( (tmp, x) => tmp.replace(x[0], x[1]), this) }

const FormatoID = /^\w+$/
const esString = item => typeof(item) === 'string'
const esID     = item => esString(item) && FormatoID.test(item)
const esFuncion= item => typeof(item) === 'function'

// CAPA DE DATOS

const normalizar  = camino => (Array.isArray(camino) ? camino : [camino]).filter(campo => !!campo)
const url         = camino => camino.join('/').toLowerCase()

const esColeccion = camino => normalizar(camino).length == 1
// const esRegistro  = camino => normalizar(camino).length == 2
// const esValor     = camino => normalizar(camino).length == 3

export class Datos {
    static cargar(){
      const datos = require('./datos.json')
      raiz.set(datos)
    }

    static referencia(camino) {
      // console.group("DATOS Referencia")
      // console.log("camino      ", camino)
      // console.log("normalizar  ", normalizar(camino))
      // console.log("url         ", url(normalizar(camino)))
      // console.groupEnd()
      return raiz.child( url( normalizar(camino) ) )
    }

    static leer(camino, alConvertir, alTraer) {
      const convertir = esColeccion(camino) ? this.valores : this.valor
      this.referencia(camino).once('value', datos => alTraer( alConvertir( convertir(datos)) ))
    }

    static observar(camino, alConvertir, alTraer) {
      const convertir = esColeccion(camino) ? this.valores : this.valor
      this.referencia(camino).on('value', datos => alTraer( alConvertir( convertir(datos) ) ))
    }

    static detener(camino){
      this.referencia(camino).off('value')
    }

    static valor(origen){ return origen.val() || {} }
    static valores(origen) { return values(origen.val()) }
}

// EXPERIMENTAL

class Registro {
  static registrar(componente){ this.componente = componente }
  static informar(nombre, valor){
    this.componente && this.componente.setState( {[nombre]: valor} )
  }

  get registro() { return this.constructor.name.toLowerCase() }
  get coleccion(){ return this.registro.plural() }

  static get registro(){ return new this().registro }
  static get coleccion(){ return new this().coleccion }

  constructor(datos){
    Object.assign(this, datos)
  }

  referencia(campo=null){
    return Datos.referencia([this.coleccion, this.id, campo])
  }

  detener(){
    Datos.detener([this.coleccion, this.id])
  }

  escribir(){
    this.id = this.id || Datos.referencia(this.coleccion).push().key
    Datos.referencia([this.coleccion, this.id]).set(this)
  }

  static observar(condicion, destino=false){
    const {registro, coleccion} = this
    destino = destino || esID(condicion) ? registro : coleccion

    this.informar(destino, false)
    if(esID(condicion)){
      const id = condicion
      Datos.observar([coleccion, id],
        datos => new this(datos),
        datos => this.informar(destino, datos)
      )
    } else {
      condicion = condicion || (x => true)
      Datos.observar(coleccion,
        datos => datos.map(item => new this(item)),
        datos => this.informar(destino, datos.filter( condicion ) )
      )
    }
  }

  static detener(id = null){
    Datos.detener([this.coleccion, id])
  }
}

export class Usuario extends Registro {
  get foto(){return `https://dl.dropboxusercontent.com/u/1086383/usuarios/${this.id}.jpg` }

  get esCliente() {return this.tipo === 'cliente' }
  get esCocinero(){return this.tipo === 'cocinero'}
  get esCadete()  {return this.tipo === 'cadete'  }
}

export class Plato extends Registro {
  get foto(){return `https://dl.dropboxusercontent.com/u/1086383/platos/${this.id}.jpg`}
}

export class Pedido extends Registro {
    get horas(){
      var horas = {}
      values(this.historia).forEach( ({estado, hora}) => horas[estado] = new Date(hora) )
      return horas
    }

    get demora(){
      const pedido  = this.horas[Estados.pedido]
      return pedido ? (new Date() - pedido) / 1000 : null
    }

    get salio(){
      const retirado = this.horas[Estados.retirado]
      return retirado ? (new Date() - retirado) / 1000 : null
    }

    get duracion(){
      const pedido    = this.horas[Estados.pedido]
      const entregado = this.horas[Estados.entregado]
      return pedido && entregado ? (entregado - pedido) / 1000 : null
    }

    get activo(){ return this.estado == Estados.recibido || this.estado == Estados.cancelado }

    enPedido(cliente){
      return this.cliente === cliente && !this.activo
    }

    enCocina(cocinero){
      return this.estado === Estados.pedido || this.cocinero === cocinero && (this.estado === Estados.aceptado || this.estado === Estados.disponible || this.estado === Estados.entregado)
    }

    enEntrega(cadete){
      return this.estado === Estados.disponible || this.cadete === cadete && this.estado === Estados.retirado
    }

    // ACCIONES
    static pedir(cliente, plato){
      const pedido = new Pedido({cliente: cliente.id, plato: plato.id})
      pedido.cambiarEstado(Estados.pedido)
    }

    cambiarEstado(estado){
      if(this.estado != estado){
        this.estado = estado
        this.historia = this.historia || []
        this.historia.push({ estado, hora: new Date().toString() })
      }
      this.escribir()
    }

    aceptar(cocinero){
      this.cocinero = cocinero
      this.cambiarEstado(Estados.aceptado)
    }

    disponer(){
      this.cambiarEstado(Estados.disponible)
    }

    cancelar(){
      this.cambiarEstado(Estados.cancelado)
    }

    retirar(cadete){
      this.cadete = cadete
      this.cambiarEstado(Estados.retirado)
    }

    entregar(){
      this.cambiarEstado(Estados.entregado)
    }

    valorar(valoracion){
      if(valoracion >= 0 || valoracion <= 5){
        this.valoracion = valoracion
        this.cambiarEstado(Estados.recibido)
      }
    }
}

// EXTRACCION DE DATOS

// class Base {
//   static get nombre(){ return this.name.toLowerCase() }
//
//   // static nombre = 'base'                      // OVERRIDE
//   static convertir(dato){ return {...dato} }  // OVERRIDE
//
//   static base(id){ return Datos.referencia([this.nombre, id]) }
//
//   static observar(condicion, alCambiar){
//     // console.log("OBSERVAR " + this.nombre, condicion)
//     if(typeof(condicion) === 'string'){
//       const id = condicion
//       Datos.observar([this.nombre, id], datos => alCambiar( this.convertir(datos) ) )
//     } else {
//       if(typeof(condicion) === 'function' && typeof(alCambiar)!== 'function'){
//         alCambiar = condicion
//         condicion = null
//       }
//       Datos.observar(this.nombre, datos => alCambiar( this.extraer(datos, condicion) ) )
//     }
//   }
//
//   static detener(id=null){
//      // console.log("DETENER " + this.nombre, id)
//      Datos.detener(typeof(id) === 'string' ? [this.nombre, id] : this.nombre)
//   }
//
//   static leer(condicion, alLeer){
//     // console.log("LEER_TODO " + this.nombre, condicion, alLeer)
//     if(typeof(condicion) === 'string'){
//       const id = condicion
//       Datos.leer([this.nombre, id], datos => alLeer( this.convertir(datos) ) )
//     } else {
//       if(typeof(condicion) === 'function' && typeof(alLeer)!== 'function'){
//         alLeer    = condicion
//         condicion = null
//       }
//       Datos.leer(this.nombre,   datos => alLeer( this.extraer(datos, condicion) ) )
//     }
//   }
//
//   static agregar(valores){
//     // console.log("AGREGAR " + this.nombre, valores)
//     const id = this.base().push().key
//     this.cambiar(id, {...valores, id})
//     return id
//   }
//
//   static cambiar(id, valores){
//     // console.log("CAMBIAR " + this.nombre, id, valores)
//     this.base(id).set(valores)
//   }
//
//   static actualizar(id, valores){
//     // console.log("ACTUALIZAR " + this.nombre, id, valores)
//     const link = this.base(id)
//     link.once('value', snap => link.set({...snap.val(), ...valores}))
//   }
//
//   static borrar(id){
//     // console.log("BORRAR " + this.nombre, id)
//     this.base(id).remove()
//   }
//
//   static extraer(datos, condicion){
//     // console.log("EXTRAER (in)  " + this.nombre, datos)
//     var lista = values(datos).map( this.convertir )
//     lista = condicion ? lista.filter(condicion) : lista
//     // console.log("EXTRAER (out) " + this.nombre, lista)
//     return lista
//   }
// }
//
// export class Usuarios extends Base {
//   // static nombre = 'usuarios'
//
//   static convertir(usuario){
//     return {...usuario, foto: `https://dl.dropboxusercontent.com/u/1086383/usuarios/${usuario.id}.jpg` }
//   }
// }
//
// export class Platos extends Base {
//   // static nombre = 'platos'
//
//   static convertir(plato){
//     const detalle = `DescripciÃ³n larga de ${plato.descripcion} bla bla bla bla bla bla bla bla bla bla bla bla`
//     return { ...plato, detalle, foto: `https://dl.dropboxusercontent.com/u/1086383/platos/${plato.id}.jpg` }
//   }
// }
//
// export class Pedidos extends Base {
//   // static nombre = 'pedidos'
//   static estado = Estados
//
//   static convertir(pedido){
//     var historia = {}
//     values(pedido.historia).forEach( ({estado, hora}) => historia[estado] = new Date(hora) )
//     return { ...pedido, historia }
//   }
//
//   static actualizar(pedido, valores){
//     super.actualizar(pedido, valores)
//     const { estado } = valores
//     if(estado){
//       Datos.referencia([this.nombre, pedido, 'historia']).push( {estado, hora: new Date().toString()} )
//     }
//   }
// }
