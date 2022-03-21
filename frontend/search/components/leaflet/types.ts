import {Marker} from "../ngo/LeafletStore";
import * as L from "leaflet";

export type LeafletMarkerFactory = (marker: Marker, pathOptions?: L.PathOptions, events?: { [k: string]: (id: string, e: L.LeafletEvent) => any}) => L.Layer
