import create from 'zustand'

export interface AppConfigState  {
  groupsDisabled?: boolean
  disableGroups: () => void
  enableGroups: () =>  void
  toggleGroupsDisabled: () => void
}

export const useAppConfigStore = create<AppConfigState>(set => ({
  groupsDisabled: undefined,
  disableGroups: () => set({groupsDisabled: false}),
  enableGroups: () => set({groupsDisabled: true}),
  toggleGroupsDisabled: () => set(({groupsDisabled}) => ({groupsDisabled: !groupsDisabled}))
}))
