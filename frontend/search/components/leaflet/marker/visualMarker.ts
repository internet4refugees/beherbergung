import {LeafletMarkerWithIdEvents} from "../types";

export interface VisualMarker<T> {
  marker: T
  getCenter: () => L.LatLng
  getId: () => string
  getPathOptions?: () => L.PathOptions | undefined
  getEvents?: () => LeafletMarkerWithIdEvents
}
