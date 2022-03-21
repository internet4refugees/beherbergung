import * as L from "leaflet";
import {VisualMarker} from "./marker/visualMarker";

export type LeafletMarkerWithIdEvents = {
  [k: string]: (id: string, e: L.LeafletEvent) => any
}

export type LeafletMarkerFactory = <T>(marker: VisualMarker<T>, pathOptions?: L.PathOptions, events?: LeafletMarkerWithIdEvents ) => L.Layer
