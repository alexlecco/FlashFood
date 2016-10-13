'use strict';

import * as firebase from 'firebase';

const dbconfig = {
  apiKey:        "AIzaSyDmlK4hhVVk9TxQT8W9RHtKdIwd5Cs12zY",
  authDomain:    "contador-903c2.firebaseapp.com",
  databaseURL:   "https://contador-903c2.firebaseio.com",
  storageBucket: "contador-903c2.appspot.com",
};

export const Estados = {
  pendiente:  'pendiente',
  pedido:     'pedido',
  aceptado:   'aceptado',
  disponible: 'disponible',
  retirado:   'retirado',
  entregado:  'entregado',
  recibido:   'recibido',

  cancelado:  'cancelado',
}

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

    static cargarPlatos(){
      const datos = require('./datos.json')
      raiz.child('platos').set(datos.platos)
    }

    static cargarUsuarios(){
      const datos = require('./datos.json')
      raiz.child('usuarios').set(datos.usuarios)
    }

    static cargar(){
      this.cargarPlatos()
      this.cargarUsuarios()
    }

    static borrarPedidos(){
      raiz.child('pedidos').set(null)
    }

    static referencia(camino) {
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
  get detalle(){ return `Esta es una descripcion larga de ${this.titulo}, solo para mostrar en el demo.`}
}

export class Pedido extends Registro {
    static get EsperaMaxima(){ return 30 * 60 } // 30 minutos o GRATIS

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

    get activo(){ return this.estado != Estados.cancelado && this.estado != Estados.pendiente && this.estado != Estados.recibido }

    enPedido(cliente){
      return this.cliente === cliente && !(this.estado == Estados.recibido || this.estado == Estados.cancelado)
    }

    enCocina(cocinero){
      return this.estado === Estados.pedido || this.cocinero === cocinero && (this.estado === Estados.aceptado || this.estado === Estados.disponible || this.estado === Estados.entregado)
    }

    enEntrega(cadete){
      return this.estado === Estados.disponible || this.cadete === cadete && this.estado === Estados.retirado
    }

    get enEspera(){
      return [Estados.aceptado, Estados.disponible, Estados.retirado].includes(this.estado)
    }

    get plato(){
      return this.platos[0].id
    }

    // ACCIONES
    static pedir(cliente, plato){
      // const pedido = new Pedido({cliente: cliente.id, {platos: {plato: {id: plato.id, cantidad: 1}}})
      const pedido = new Pedido({cliente: cliente.id})
      pedido.agregar(plato.id)
      pedido.cambiarEstado(Estados.pendiente)
    }

    cambiarEstado(estado){
      if(this.estado != estado){
        this.estado = estado
        this.historia = this.historia || []
        this.historia.push({ estado, hora: new Date().toString() })
      }
      this.escribir()
    }

    agregar(plato){
      this.platos = this.platos || []
      let actual = this.platos.find( p => p.id == plato)
      if(actual){
        actual.cantidad += 1
      } else {
        this.platos.push({ id: plato, cantidad: 1, valoracion: 0 })
      }
      console.log("AGREGAR Plato", plato, this.platos)
    }

    quitar(plato){
      this.platos = this.platos || []
      let actual = this.platos.find( p => p.id == platos)
      if(actual){
        actual.cantidad -= 1
      }
      this.platos = this.platos.filter( p => p.cantidad > 0)
      this.escribir()
    }

    aceptar(cocinero){
      this.cocinero = cocinero
      this.cambiarEstado(Estados.aceptado)
    }

    disponer(){
      this.cambiarEstado(Estados.disponible)
    }

    confirmar(){
      this.cambiarEstado(Estados.pedido)
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

    valoracionActual(){
      return this.platos[0].valoracion || 0
    }

    valoracion(valor){
      if(valor >= 0 || valor <= 5){
        this.platos[0].valoracion = valor
      }
    }

    valorar(){
      if(this.valoracionActual() >= 0){
        this.cambiarEstado(Estados.recibido)
      }
    }

    entregarEn(lugar){
      this.lugar = lugar
      this.escribir()
    }
}
