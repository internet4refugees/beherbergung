import React from 'react'
import {Marker} from "../../ngo/LeafletStore";
import {CircleMarker} from "@monsonjeremy/react-leaflet";

type CircleMarkerProps = { marker: Marker, color: string, onMarkerClick?: (id: string) => void }

const CustomCircleMarker = ({
                              marker: m,
                              color,
                              onMarkerClick
                            }: CircleMarkerProps) =>
  <CircleMarker
    center={[m.lat, m.lng]}
    pathOptions={{color: color}}
    radius={m.radius / 100}
    eventHandlers={{click: () => onMarkerClick && onMarkerClick(m.id)}}>
  </CircleMarker>

export default CustomCircleMarker
