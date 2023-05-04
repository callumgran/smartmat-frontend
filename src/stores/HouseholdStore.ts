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

export type HouseholdStoreInfo = Array<{ householdId: string; householdName: string }>;

export const useHouseholdStore = defineStore('HouseholdStore', {
  state: () => ({
    households: [] as HouseholdStoreInfo,
    selectedIndex: -1,
  }),
  actions: {
    appendHouseholds(households: HouseholdDTO[]) {
      for (const household of households) {
        this.$state.households.push({ householdId: household.id, householdName: household.name });
      }
    },
    appendHousehold(household: HouseholdDTO) {
      this.$state.households.push({ householdId: household.id, householdName: household.name });
    },
    appendAndSelectHousehold(household: HouseholdDTO) {
      this.$state.households.push({ householdId: household.id, householdName: household.name });
      this.$state.selectedIndex = this.$state.households.length - 1;
    },
    selectHouseholdByName(householdName: string) {
      const index = this.$state.households.findIndex(
        (household) => household.householdName === householdName,
      );
      this.$state.selectedIndex = index;
    },
    selectHouseholdById(householdId: string) {
      const index = this.$state.households.findIndex(
        (household) => household.householdId === householdId,
      );
      this.$state.selectedIndex = index;
    },
    clearHousehold() {
      this.$state.households = [];
      this.$state.selectedIndex = -1;
    },
    selectNone() {
      this.$state.selectedIndex = -1;
    },
    selectFirst() {
      this.$state.selectedIndex = 0;
    },
  },
  getters: {
    getSelectedId(): string {
      if (this.selectedIndex === -1 && this.households.length === 0) {
        return '';
      }
      if (this.selectedIndex !== -1) {
        return this.households[this.selectedIndex].householdId;
      }
      return this.households[0].householdId;
    },
    getSelectedName(): string {
      if (this.selectedIndex === -1 && this.households.length === 0) {
        return '';
      }
      if (this.selectedIndex !== -1) {
        return this.households[this.selectedIndex].householdName;
      }
      return this.households[0].householdName;
    },
    getAllHouseholdNames(): string[] {
      return this.households.map((household) => household.householdName);
    },
  },
  persist: {
    enabled: true,
    strategies: [{ key: 'household', storage: cookiesStorage }],
  },
});
