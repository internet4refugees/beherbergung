import React, {useCallback, useEffect} from 'react'
import * as L from "leaflet";
import {useMap, useMapEvent} from "@monsonjeremy/react-leaflet";
import {LatLng} from "../util/geo";

export type BoundsChangeListenerProps = {
  onBoundsChange?: (bounds: L.LatLngBounds) => void
  onCenterChange?: (center: LatLng) => void
}
const BoundsChangeListener: (props: BoundsChangeListenerProps) => null =
  ({onBoundsChange, onCenterChange}) => {

  const map = useMap()

  const updateBounds = useCallback(
    () => {
      const {lat, lng} = map.getCenter()
      onCenterChange && onCenterChange([lat, lng])

      // onBoundsChange is unused at the moment
      onBoundsChange && onBoundsChange(
        map.getBounds()
      )
    },
    [map, onBoundsChange, onCenterChange])

  useEffect(() => {
    updateBounds()
  }, [map, updateBounds])

  useMapEvent('moveend', (e) => updateBounds())
  useMapEvent('load', (e) => updateBounds())
  return null
}


export default BoundsChangeListener
