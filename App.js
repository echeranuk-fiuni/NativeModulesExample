/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type {Node} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import MapView, { Callout, Circle, Marker, Polygon } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 3,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const initialRegion = {
  latitude: -27.2952363,
  longitude: -56.1774497,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const initialMarkers = [
  { key: 'mark1', title: 'Marcador 1', description: 'Desc 1', coordinate: { latitude: -27.2952363, longitude: -56.1774497 }},
];

const App: () => Node = () => {

  const [region, setRegion] = useState(initialRegion);
  const [markers, setMarkers] = useState(initialMarkers);
  const [circle, setCircle] = useState(undefined);
  const [polygon, setPolygon] = useState(undefined);

  const handleRegionChange = (region) => {
    setRegion(region);
  }

  const handleMarkerDragEnd = (e, marker) => {
    const newMarkers = markers.map(m => m.key === marker.key ? {...m, coordinate: e.nativeEvent.coordinate} : m);
    setMarkers(newMarkers);
  }

  const handleAddMarker = (e) => {
    const {coordinate} = e.nativeEvent;
    const key = Number.parseInt(Math.random() * 9999999999);
    const newMarker = {key, title: key, description: key, coordinate};
    const newMarkers = [...markers, newMarker];
    setMarkers(newMarkers);
    setPolygon(undefined);
  }

  const handleMarkerClick = (e, marker) => {
    setRegion({
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      longitudeDelta: 0.5,
      latitudeDelta: 0.5,
    });
    setCircle({
      center: marker.coordinate,
    });
  }

  const handleMapPress = (e) => {
    const center = e.nativeEvent.coordinate;
    setCircle(undefined);
    setPolygon([
      {latitude: center.latitude + 0.2, longitude: center.longitude + 0.2},
      {latitude: center.latitude - 0.2, longitude: center.longitude + 0.2},
      {latitude: center.latitude - 0.2, longitude: center.longitude - 0.2},
      {latitude: center.latitude + 0.2, longitude: center.longitude - 0.2},
    ]);
  }

  return (
    <View style={styles.flex1}>
      <View style={styles.flex1}>
      <Text>Hola Mundo</Text>
      <Text>Region: {JSON.stringify(region)}</Text>
      <Text>Marcadores:</Text>
      <View>
        {markers.map(m => <Text key={m.key}>* {JSON.stringify(m)}</Text>)}
      </View>
      </View>
      <View
        style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChange={handleRegionChange}
          onDoublePress={handleAddMarker}
          onPress={handleMapPress}
        >
          {circle && (
            <Circle
              center={circle.center}
              radius={1000}
              fillColor='rgba(255,0,0,0.5)'
            />
          )}
          {polygon && (
            <Polygon
              coordinates={polygon}
              fillColor='rgba(0,255,0,0.5)'
            />
          )}
          {markers.map(marker => (
            <Marker
              draggable
              key={marker.key}
              coordinate={marker.coordinate}
              onDragEnd={(e) => handleMarkerDragEnd(e, marker)}
              onPress={(e) => handleMarkerClick(e, marker)}
            >
              <Callout>
                <Text>{marker.title}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
};

export default App;
