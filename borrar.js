const PaginaProducto = ({plato, alElegir}) => (
  <View style={{width: screenSize.width, height: screenSize.height - 81}}>
      <Grid>
        <Row style={{height:screenSize.width}}>
          <Image source={{uri: plato.foto}} style={{margin: 5, width: screenSize.width-10, height: screenSize.width-10}}  />
        </Row>
        <Row>
          <Text style={styles.plato_descripcion}> {plato.descripcion} </Text>
          <Text style={styles.plato_detalle}> {plato.detalle} </Text>
        </Row>
        <Row>
          <Button princia onPress={ () => alElegir()} style={{margin: 5, width: screenSize.width-10, height: 81}}>¡Pedir Ya! </Button>
        </Row>
        <Row>
          <View style={{backgroundColor: 'yellow', opacity:0.6, position: 'absolute', top: screenSize.width-60, left: screenSize.width-130, height: 50, width: 120, alignItems: 'center'}}>
            <Text style={styles.plato_precio}> ${plato.precio} </Text>
          </View>
        </Row>
      </Grid>
  </View>
)
