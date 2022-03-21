import React, {useCallback, useEffect} from 'react'
import {IdLatLngCallback} from "../util/geo";
import {useMap} from "@monsonjeremy/react-leaflet";
import * as L from "leaflet";

type FitBoundsProps = {
  onSignatureUpdate: (fitBoundsToMarkerIdCallback: IdLatLngCallback) => void
}

const FitBounds: (props: FitBoundsProps) => null = ({onSignatureUpdate}) => {

  const map = useMap()

  const fitBoundsToMarkerId: IdLatLngCallback = useCallback(
    (coordinate) => {
      if (map && coordinate) {
        const offset = 0.07
        const [lat, lng] = coordinate
        const bounds = L.latLngBounds(L.latLng([lat - offset, lng - offset]), L.latLng([lat + offset, lng + offset]))
        map.fitBounds(bounds)
      }
    },
    [map])


  useEffect(() => {
    onSignatureUpdate(fitBoundsToMarkerId)
  }, [map, onSignatureUpdate, fitBoundsToMarkerId]);
  return null
}

export default FitBounds
