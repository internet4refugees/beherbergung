import React, {useEffect, useState} from 'react'
import {Marker} from "../ngo/LeafletStore";
import * as L from "leaflet";
import {useMap} from "@monsonjeremy/react-leaflet";
import {LeafletMarkerFactory} from "./types";

require('leaflet.markercluster');

type MarkerClusterLayerProps = {
  markers: Marker[],
  leafletMarkerFactory: LeafletMarkerFactory
  clusterGroupOptions?: L.MarkerClusterGroupOptions
  layerOptions?: L.LayerOptions
  disableCluster?: boolean
}


const MarkerClusterLayer: (props: MarkerClusterLayerProps) => null =
  ({markers, leafletMarkerFactory, clusterGroupOptions, disableCluster, layerOptions}) => {

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
      const filterDataLayer = (layerId: string, _markers: Marker[]) => {
        try {
          _markers.forEach((marker) => {
            layer.addLayer(leafletMarkerFactory(marker, {color: 'blue'}, {
              click: id => {
                console.log(id)
              }
            }))
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
    }, [map, markers, leafletMarkerFactory, disableCluster]);

    return null
  }

export default MarkerClusterLayer
