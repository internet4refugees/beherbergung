import create from 'zustand'

export interface Marker
 {id: string,
  lat: number,
  lng: number,
  radius: number,  // in meters
  content: string  // TODO react-child?
 }

export interface LeafletState {
 markers: Marker[] 
 setMarkers: (markers: Marker[]) => void
}

export const useLeafletStore = create<LeafletState>(set => ({
  markers: [],
  setMarkers: (markers: Marker[]) => set( _orig => ({markers}) )
}))
