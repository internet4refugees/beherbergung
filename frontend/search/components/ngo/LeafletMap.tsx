import React, {useCallback, useEffect, useState} from 'react'
import 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvent
} from '@monsonjeremy/react-leaflet'
import * as L from 'leaflet'
type LeafletMapProps = {onBoundsChange?: (bounds: L.LatLngBounds) => void}

const BoundsChangeListener = ({onBoundsChange}: {onBoundsChange?: (bounds: L.LatLngBounds) => void}) => {
  const map = useMap()

  const updateBounds = useCallback(
    () => {
      onBoundsChange && onBoundsChange(
        map.getBounds()
      )
    },
    [map],
  );

  useEffect(() => {
    updateBounds()
  }, [map, updateBounds])

  useMapEvent('moveend', (e) => updateBounds())
  useMapEvent('load', (e) =>  updateBounds())
  return null
}
const LeafletMap = ({onBoundsChange}: LeafletMapProps) => {
  const [zoom, setZoom] = useState<number>( 8 )
  const [position, setPosition] = useState<L.LatLngExpression>(  {
    lat: 51.0833,
    lng: 13.73126,
  } )

  return (
    <>
      <MapContainer
        className={'leafletMap'}
        style={{
          height: '100%',
          minHeight: '400px',
          minWidth: '400px',
        }}
        center={position}
        zoom={zoom}
        maxZoom={24}
      >
        <BoundsChangeListener onBoundsChange={onBoundsChange}/>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap.default">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={18}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terain">
            <TileLayer url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png"

            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="swisstopo">
            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/256/{z}/{x}/{y}.png?key=gR2UbhjBpXWL68Dc4a3f" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Arcgis Satelite">
            <TileLayer
              attribution='&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community '
              url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={20}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
    </>)
}

export default LeafletMap
