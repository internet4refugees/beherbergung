import * as L from "leaflet";
import {LeafletMarkerFactory} from "../types";

export const customCircleMarker: LeafletMarkerFactory = function (marker, pathOptions = {}, events = {}) {

  let m = L.circleMarker([marker.lat, marker.lng], {
    radius: marker.radius / 100,
    ...pathOptions
  })
  Object.entries(events).forEach(([type, callback]) => {
    try {
      // @ts-ignore
      m.on(type, (e) => callback(marker.id, e))
    } catch (e) {
      console.error(`cannot add event handler of type '${type}'`, e)
    }
  })
  return m

}
