import { Dimensions, Platform, Image } from 'react-native';

export class Pantalla {
  static get size(){return Dimensions.get('window')}

  static get navegacion(){return Platform.OS === 'ios' ? 64 : 85}
  static get pie(){return 64}

  static get margen(){return 10}
  static get separacion(){return 5}

  static get ancho(){return this.size.width - 2 * this.margen}
  static get alto(){return this.size.height - 2 * this.margen - this.navegacion }

  static get pagina(){ return {width: this.size.width, height: this.size.height - this.navegacion}}
  static get contenido(){return {position: 'absolute', left: this.margen, top: this.margen, width: this.ancho, height: this.alto}}

  static get accion(){return {position: 'absolute', left: 0, bottom: 0, right: 0, height: this.pie}}
  static imagen(relacion = 1.0){return {width: this.ancho, height: this.ancho / relacion }}
}
