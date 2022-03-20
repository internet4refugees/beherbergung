import React, { useCallback, useEffect, useState } from 'react'
import 'leaflet'
import 'leaflet/dist/leaflet.css'
import { config } from "../../config"

import {
  LayersControl,
  MapContainer,
  //Marker,
  //Polygon,
  //Polyline,
  Circle,
  TileLayer,
  useMap,
  useMapEvent
} from '@monsonjeremy/react-leaflet'
import * as L from 'leaflet'
import {Marker, useLeafletStore} from './LeafletStore'
import {IdLatLngCallback} from "../util/geo";

type LeafletMapProps = {onBoundsChange?: (bounds: L.LatLngBounds) => void}

const BoundsChangeListener: ({onBoundsChange}: { onBoundsChange?: (bounds: L.LatLngBounds) => void }) => null = ({onBoundsChange}) => {
  const { setCenter } = useLeafletStore()

  const map = useMap()

  const updateBounds = useCallback(
    () => {
      const {lat, lng} = map.getCenter()
      setCenter([lat, lng])

      // onBoundsChange is unused at the moment
      onBoundsChange && onBoundsChange(
        map.getBounds()
      )
    },
    [map, onBoundsChange, setCenter],
  )

  useEffect(() => {
    updateBounds()
  }, [map, updateBounds])

  useMapEvent('moveend', (e) => updateBounds())
  useMapEvent('load', (e) =>  updateBounds())
  return null
}

const FitBounds: (props: { onSignatureUpdate: (fitBoundsToMarkerIdCallback: IdLatLngCallback) => void}) => null = ({onSignatureUpdate}  ) => {

  const map = useMap()

  const fitBoundsToMarkerId: IdLatLngCallback = useCallback(
    (coordinate) => {
      if(map && coordinate) {
        const offset = 0.07
        const [lat, lng] = coordinate
        const bounds = L.latLngBounds(L.latLng([ lat - offset, lng - offset]), L.latLng([lat + offset, lng + offset]))
        map.fitBounds(bounds)
      }},
    [map])


  useEffect(() => {
    onSignatureUpdate(fitBoundsToMarkerId)
  }, [map, onSignatureUpdate, fitBoundsToMarkerId]);


  return null
}

const CircleMarker = ({marker: m, color, onMarkerClick }: {marker: Marker, color: string, onMarkerClick?: (id: string) => void }) =>
  <Circle
    center={[m.lat, m.lng]}
    radius={m.radius}
    pathOptions={{color: color}}
    eventHandlers={{click: () => onMarkerClick && onMarkerClick(m.id)}}>
  </Circle>

const LeafletMap = ({onBoundsChange}: LeafletMapProps) => {
  const [zoom, setZoom] = useState<number>( 8 )
  const [position, setPosition] = useState<L.LatLngExpression>(  {
    lat: config.initial_lat || 51.0833,
    lng: config.initial_lng || 13.73126,
  } )
  const { markers, selectedId, setSelectedId, setZoomToCoordinateCallback } = useLeafletStore()

  const setZoomToIdCallbackCallback: (fitBoundsToMarkerIdCallback: IdLatLngCallback) => void  =  useCallback(
    fitBoundsToMarkerIdCallback => setZoomToCoordinateCallback(fitBoundsToMarkerIdCallback),
    [setZoomToCoordinateCallback],
  );


  const handleMarkerSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
    },
    [setSelectedId]);

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
        maxZoom={18}
      >
        <BoundsChangeListener onBoundsChange={onBoundsChange}/>
        <FitBounds  onSignatureUpdate={setZoomToIdCallbackCallback }/>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Terrain">
            <TileLayer
              attribution={"Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. Data by <a href=\"http://openstreetmap.org\">OpenStreetMap</a>, under <a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>."}
              url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png"/>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.default">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={18}
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


          {markers
            .filter(({withinFilter, id}) => !withinFilter && id !== selectedId )
            .map((m, i) =>
              <CircleMarker
                key={m.id + i}
                marker={m} color={'grey'}
                onMarkerClick={handleMarkerSelect}/>)}
          {markers
            .filter(({withinFilter, id}) => withinFilter  && id !== selectedId)
            .map((m, i) =>
              <CircleMarker
                key={m.id + i}
                marker={m} color={'blue'}
                onMarkerClick={handleMarkerSelect}/>)}
          {markers
            .filter(({id}) => id === selectedId )
            .map((m, i) =>
              <CircleMarker
                key={m.id + i}
                marker={m} color={'red'}
                onMarkerClick={handleMarkerSelect}/>)}
        </LayersControl>
      </MapContainer>
    </>)
}

export default LeafletMap
