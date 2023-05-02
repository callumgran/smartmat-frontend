import { HouseholdDTO } from '@/api';
import Cookies from 'js-cookie';
import { defineStore } from 'pinia';

const cookiesStorage: Storage = {
  setItem(key, state) {
    return Cookies.set(key, state, { expires: 3 });
  },
  getItem(key) {
    const store = Cookies.get(key);
    if (store === undefined) {
      return '';
    }

    return Cookies.get(key) || '';
  },
  length: 0,
  clear: function (): void {
    Cookies.remove('household');
  },
  key: function (index: number): string | null {
    throw new Error('Function not implemented.');
  },
  removeItem: function (key: string): void {
    throw new Error('Function not implemented.');
  },
};
export const useHouseholdStore = defineStore('HouseholdStore', {
  state: () => ({
    householdId: '',
    householdName: '',
  }),
  actions: {
    setHousehold(household: HouseholdDTO) {
      this.$state.householdId = household.id || '';
      this.$state.householdName = household.name || '';
    },
    clearHousehold() {
      this.$state.householdId = '';
      this.$state.householdName = '';
    },
  },
  getters: {
    getHouseholdId(): string {
      return this.householdId;
    },
  },
  persist: {
    enabled: true,
    strategies: [{ key: 'household', storage: cookiesStorage }],
  },
});
