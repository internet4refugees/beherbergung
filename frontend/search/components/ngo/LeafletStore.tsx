import create from 'zustand'
import {IdLatLngCallback, LatLng} from "../util/geo";

export interface Marker {
  id: string,
  lat: number,
  lng: number,
  radius: number,  // in meters
  content: string,  // TODO react-child?
  withinFilter?: boolean
}

export interface LeafletState {
  center: LatLng|null  // at the moment not used for setting the maps center, but only for distance calculation onBoundsChange
  setCenter: (center: LatLng) => void
  markers: Marker[]
  setMarkers: (markers: Marker[]) => void
  setWithinFiltered: (ids: string[]) => void
  selectedId?: string | null
  setSelectedId: (selectedId?: string | null) => void
  zoomToCoordinate?: IdLatLngCallback
  setZoomToCoordinateCallback: (callback: IdLatLngCallback) => void
}

export const useLeafletStore = create<LeafletState>(set => ({
  center: null,
  setCenter: center => set( _orig => ({center}) ),
  markers: [],
  setMarkers: markers => set( _orig => ({markers}) ),
  selectedId: null,
  setSelectedId: selectedId => set( _orig => ({selectedId}) ),
  setWithinFiltered: ids => set(({markers}) =>
    ({markers: markers.map(m => ({
        ...m,
        withinFilter: ids.includes( m.id )}))})),
  setZoomToCoordinateCallback: callback => set({zoomToCoordinate: callback})
}))
