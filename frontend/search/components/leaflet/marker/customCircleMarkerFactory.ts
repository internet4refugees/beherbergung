import * as L from "leaflet";
import {LeafletMarkerFactory} from "../types";

export const customCircleMarkerFactory: LeafletMarkerFactory = function (marker, pathOptions = {}, events = {}) {

  const _pathOptions = marker.getPathOptions && marker.getPathOptions() || {}
  let m = L.circleMarker(marker.getCenter(), {
    radius: 20,
    ...pathOptions,
    ..._pathOptions
  })
  Object.entries(events).forEach(([type, callback]) => {
    try {
      // @ts-ignore
      m.on(type, (e) => callback(marker.getId(), e))
    } catch (e) {
      console.error(`cannot add event handler of type '${type}'`, e)
    }
  })
  return m

}
