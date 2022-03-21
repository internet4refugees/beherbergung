import create from 'zustand'
import {HostOfferLookupTableDataType} from "../ngo/HostOfferLookupTable";

export interface AppTempState {
  infoDrawerOpen?: boolean
  toggleInfoDrawer: () => void
  openInfoDrawer: () => void
  selectedHostOffer?: HostOfferLookupTableDataType
  hostOffers?: HostOfferLookupTableDataType[]
  setHostOffers?: (offers: HostOfferLookupTableDataType[]) => void
}

export const useAppTempStore = create<AppTempState>(set => ({
  infoDrawerOpen: false,
  toggleInfoDrawer: () => set(({infoDrawerOpen}) => ({infoDrawerOpen: !infoDrawerOpen})),
  openInfoDrawer: () => set({infoDrawerOpen: true}),
  hostOffers: [],
  setHostOffers: offers => set({hostOffers: offers})

}))
