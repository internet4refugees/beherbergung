import create from 'zustand'

export interface AppConfigState  {
  groupsDisabled?: boolean
  disableGroups: () => void
  enableGroups: () =>  void
  toggleGroupsDisabled: () => void
  markerClusterDisabled?: boolean
  toggleMarkerCluster: () => void
  debugEnabled: boolean
  toggleDebugEnabled: () => void
}

export const useAppConfigStore = create<AppConfigState>(set => ({
  groupsDisabled: undefined,
  disableGroups: () => set({groupsDisabled: false}),
  enableGroups: () => set({groupsDisabled: true}),
  toggleGroupsDisabled: () => set(({groupsDisabled}) => ({groupsDisabled: !groupsDisabled})),
  markerClusterDisabled: true,
  toggleMarkerCluster: () => set(({markerClusterDisabled}) => ({markerClusterDisabled: !markerClusterDisabled})),
  debugEnabled: false,
  toggleDebugEnabled: () => set(({debugEnabled}) => ({debugEnabled: !debugEnabled}))
}))
