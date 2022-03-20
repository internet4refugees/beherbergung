import {createPathComponent} from '@monsonjeremy/react-leaflet-core';
import L, {LeafletEventHandlerFn, MarkerClusterGroupOptions} from 'leaflet';
import {ReactNode} from "react";


require('leaflet.markercluster');

type MarkerClusterGroupProps = {
  children?: ReactNode
  eventHandler?: { [k: string]: LeafletEventHandlerFn }
} & MarkerClusterGroupOptions

const MarkerClusterGroup = createPathComponent(
  ({children: _c, eventHandler, ...props}: MarkerClusterGroupProps, ctx) => {
    const clusterProps: MarkerClusterGroupOptions = props;
    const clusterEvents: { [k: string]: LeafletEventHandlerFn } = eventHandler || {};

    // Creating markerClusterGroup Leaflet element
    // @ts-ignore
    const markerClusterGroup: L.MarkerClusterGroup = new L.markerClusterGroup(clusterProps);

    // Initializing event listeners
    Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
      const clusterEvent = eventAsProp.substring(2).toLowerCase();
      markerClusterGroup.on(clusterEvent, callback);
    });

    return {
      instance: markerClusterGroup,
      context: {...ctx, layerContainer: markerClusterGroup},
    };
  }
);

export default MarkerClusterGroup;
