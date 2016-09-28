'use strict';

import React,  { Component } from 'react';
import { Stylesheet, requireNativeComponent, Text, View } from 'react-native';

var DGTAuthenticateButtonView = requireNativeComponent('DGTAuthenticateButtonView', DGTAuthenticateButtonView);

var DigitsAuthenticateButton = React.createClass({
   render: function() {
      return (
        <View>
        <Text>Adentro</Text>
         <DGTAuthenticateButtonView  />
         </View>
      );
   }
});

module.exports = DigitsAuthenticateButton;
