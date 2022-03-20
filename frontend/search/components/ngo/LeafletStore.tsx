import create from 'zustand'
import * as L from 'leaflet'

export interface Marker {
  id: string,
  lat: number,
  lng: number,
  radius: number,  // in meters
  content: string,  // TODO react-child?
  withinFilter?: boolean
}

export interface LeafletState {
  center: L.LatLng|null  // at the moment not used for setting the maps center, but only for distance calculation onBoundsChange
  setCenter: (center: L.LatLng) => void
  markers: Marker[]
  setMarkers: (markers: Marker[]) => void
  setWithinFiltered: (ids: string[]) => void
  selectedId?: string | null
  setSelectedId: (selectedId?: string | null) => void
  zoomedId?: string | null
  zoomToId: (id?: string | null) => void
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
  zoomedId: null,
  zoomToId: id => set({zoomedId: id})
}))
