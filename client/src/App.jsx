import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Map from 'react-map-gl';
import * as React from 'react';
import mapboxgl from 'mapbox-gl';


function App() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });

  React.useEffect(() => {
    if(viewState.latitude < 24.52) viewState.latitude = 24.52
    if(viewState.latitude > 49.38) viewState.latitude = 49.38
    if(viewState.longitude < 66.95) viewState.latitude = 66.95
    if(viewState.longitude > 124.77) viewState.latitude = 124.77 
  }, [map, viewState])

  var map = <Map
    {...viewState}
    mapboxAccessToken='pk.eyJ1IjoiaHVza2llczRsIiwiYSI6ImNsZHc4YjA2ajA0dDIzcG40MHk4Y3hoenEifQ.RVPl4GldZwjngT4CGN12Iw'
    onMove={evt => setViewState(evt.viewState)}
    mapStyle="mapbox://styles/mapbox/light-v11"
    style={{width: 1440, height: 1024}}
  />
  return map;
}

export default App
