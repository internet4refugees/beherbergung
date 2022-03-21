import React, {useEffect, useState} from 'react'
import * as L from "leaflet";
import {useMap} from "@monsonjeremy/react-leaflet";
import {LeafletMarkerFactory} from "./types";
import {VisualMarker} from "./marker/visualMarker";

require('leaflet.markercluster');

type MarkerClusterLayerProps<T> = {
  markers: VisualMarker<T>[],
  leafletMarkerFactory: LeafletMarkerFactory
  clusterGroupOptions?: L.MarkerClusterGroupOptions
  layerOptions?: L.LayerOptions
  disableCluster?: boolean
}


const MarkerClusterLayer: <T,>(props: MarkerClusterLayerProps<T>) => null =
  <T,>({markers, leafletMarkerFactory, clusterGroupOptions, disableCluster, layerOptions}: MarkerClusterLayerProps<T>) => {

    const map = useMap()

    const [groupLayer ] = useState(L.markerClusterGroup(clusterGroupOptions));
    const [normalLayer] = useState(L.featureGroup(null,layerOptions));

    useEffect(() => {
      console.log("map initialized!")
      const layer = disableCluster ? normalLayer : groupLayer
      const clearAll = () => {
        [groupLayer, normalLayer].forEach(l => {
          try {
            map.removeLayer(l)
            l.clearLayers();
          } catch (e) {}
        })
      }
      const filterDataLayer = (layerId: string, _markers: VisualMarker<T>[]) => {
        try {
          _markers.forEach((marker) => {
            layer.addLayer(leafletMarkerFactory(
              marker,
              {color: 'blue'},
              marker.getEvents && marker.getEvents() || {}))
          });
        } catch (e) {
          console.error('cannot create cluster', e)
        }
        return layer;
      };

      if (map) {
        clearAll()
        map.addLayer(filterDataLayer('cluster', markers))
      }

      return () => {
        console.log('destroy')
        try {
          map.removeLayer(layer)
        } catch (e) {
        }
      }
    }, [map, markers, leafletMarkerFactory, disableCluster, groupLayer, normalLayer]);

    return null
  }

export default MarkerClusterLayer
