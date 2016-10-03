import React, { Component } from 'react';
import { View, Spinner,} from 'native-base';

const Cargando = ({color}) =>
  <View style={{flex:1, alignItems: 'stretch'}}>
    <Spinner style={{flex:1}} color={color} />
  </View>
