import create from 'zustand'
import * as L from 'leaflet'

export interface Marker {
  id: string,
  lat: number,
  lng: number,
  radius: number,  // in meters
  content: string  // TODO react-child?
}

export interface LeafletState {
  center: L.LatLng|null  // at the moment not used for setting the maps center, but only for distance calculation onBoundsChange
  setCenter: (center: L.LatLng) => void
  markers: Marker[]
  setMarkers: (markers: Marker[]) => void
  filteredMarkers: Marker[]
  setFilteredMarkers: (filteredMarkers: Marker[]) => void
}

export const useLeafletStore = create<LeafletState>(set => ({
  center: null,
  setCenter: center => set( _orig => ({center}) ),
  markers: [],
  setMarkers: markers => set( _orig => ({markers}) ),
  filteredMarkers: [],
  setFilteredMarkers: filteredMarkers => set( _orig => ({filteredMarkers}) )
}))
