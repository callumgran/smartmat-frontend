import { defineStore } from 'pinia';

export const useHouseholdStore = defineStore('HouseholdStore', {
  state: () => ({
    householdId: '',
    householdName: '',
  }),
  actions: {
    setHousehold(householdId: string, householdName: string) {
      this.$state.householdId = householdId;
      this.$state.householdName = householdName;
    },
    clearHousehold() {
      this.$state.householdId = '';
      this.$state.householdName = '';
    },
  },
});
