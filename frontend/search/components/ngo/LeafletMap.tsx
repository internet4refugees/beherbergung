import React, {useCallback, useEffect, useState} from 'react'
import 'leaflet'
import 'leaflet/dist/leaflet.css'
import {config} from "../../config"

import {
  LayersControl,
  MapContainer,
  TileLayer
} from '@monsonjeremy/react-leaflet'
import * as L from 'leaflet'
import {Marker, useLeafletStore} from './LeafletStore'
import {IdLatLngCallback} from "../util/geo";
import {useAppConfigStore} from "../config/appConfigStore";
import CustomCircleMarker from "../leaflet/marker/CustomCircleMarker";
import MarkerClusterLayer from "../leaflet/MarkerClusterLayer";
import {customCircleMarkerFactory} from "../leaflet/marker/customCircleMarkerFactory";
import BoundsChangeListener from "../leaflet/BoundsChangeListener";
import FitBounds from "../leaflet/FitBounds";
import {VisualMarker} from "../leaflet/marker/visualMarker";

type LeafletMapProps = { onBoundsChange?: (bounds: L.LatLngBounds) => void }

const createClusterCustomIcon = function (cluster: L.MarkerCluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "marker-cluster-custom",
    iconSize: L.point(40, 40, true)
  });
};

const AllMarkers = ({
                      markers,
                      selectedId,
                      onMarkerSelect
                    }: { markers: Marker[], selectedId?: string, onMarkerSelect?: (id?: string) => void }) => {
  return <>
    {markers
      .filter(({withinFilter, id}) => !withinFilter && id !== selectedId)
      .map((m, i) =>
        <CustomCircleMarker
          key={m.id + i}
          marker={m} color={'grey'}
          onMarkerClick={onMarkerSelect}/>)}
    {markers
      .filter(({withinFilter, id}) => withinFilter && id !== selectedId)
      .map((m, i) =>
        <CustomCircleMarker
          key={m.id + i}
          marker={m} color={'blue'}
          onMarkerClick={onMarkerSelect}/>)}
  </>
}

const LeafletMap = ({onBoundsChange}: LeafletMapProps) => {
  const [zoom, setZoom] = useState<number>(10)
  const [position, setPosition] = useState<L.LatLngExpression>({
    lat: config.initial_lat || 51.0833,
    lng: config.initial_lng || 13.73126,
  })
  const {markers, selectedId, setSelectedId, setZoomToCoordinateCallback, setCenter} = useLeafletStore()
  const {markerClusterDisabled} = useAppConfigStore()

  const setZoomToIdCallbackCallback: (fitBoundsToMarkerIdCallback: IdLatLngCallback) => void = useCallback(
    fitBoundsToMarkerIdCallback => setZoomToCoordinateCallback(fitBoundsToMarkerIdCallback),
    [setZoomToCoordinateCallback],
  );

  const handleMarkerSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
    },
    [setSelectedId]);

  const [visualMarkersOutsideFilter, setVisualMarkersOutsideFilter] = useState<VisualMarker<Marker>[]>([]);
  const [visualMarkersWithinFilter, setVisualMarkersWithinFilter] = useState<VisualMarker<Marker>[]>([]);

  useEffect(() => {
    const _visualMarkers: VisualMarker<Marker>[] = markers?.map((marker) => ({
      marker,
      getId: () => marker.id,
      getPathOptions: () => ({
        color: marker.id == selectedId ? 'red' : (marker.withinFilter ? 'blue' : 'grey'),
        radius: marker.radius / 100
      }),
      getCenter: () => L.latLng([marker.lat, marker.lng]),
      getEvents: () => ({
        click: handleMarkerSelect
      })
    })) || []
    setVisualMarkersOutsideFilter(_visualMarkers.filter(({marker}) => marker.id === selectedId || !marker.withinFilter ))
    setVisualMarkersWithinFilter(_visualMarkers.filter(({marker}) => marker.withinFilter ))
  }, [markers,selectedId, handleMarkerSelect]);


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
        <BoundsChangeListener
          onCenterChange={setCenter}
          onBoundsChange={onBoundsChange}/>
        <FitBounds onSignatureUpdate={setZoomToIdCallbackCallback}/>
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
            <TileLayer
              url="https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/256/{z}/{x}/{y}.png?key=gR2UbhjBpXWL68Dc4a3f"/>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Arcgis Satelite">
            <TileLayer
              attribution='&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community '
              url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={20}
            />
          </LayersControl.BaseLayer>
          <MarkerClusterLayer
            markers={visualMarkersOutsideFilter}
            disableCluster={true}
            leafletMarkerFactory={customCircleMarkerFactory}
          />
          <MarkerClusterLayer
            markers={visualMarkersWithinFilter}
            disableCluster={markerClusterDisabled}
            leafletMarkerFactory={customCircleMarkerFactory}
            clusterGroupOptions={{
              maxClusterRadius: 60,
              disableClusteringAtZoom: 14,
              zoomToBoundsOnClick: true,
              spiderfyOnMaxZoom: true,
              removeOutsideVisibleBounds: true,
              iconCreateFunction: createClusterCustomIcon
            }}/>
        </LayersControl>
      </MapContainer>
    </>)
}

export default LeafletMap
