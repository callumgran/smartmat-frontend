<template>
  <v-app-bar class="elevation-0">
    <v-toolbar-title data-testid="navbar-title" style="font-weight: 600; font-size: 1.5em"
      ><router-link :to="{ name: 'base' }">SmartMat</router-link></v-toolbar-title
    >
    <v-toolbar-items v-if="userStore.isLoggedIn">
      <v-select
        prepend-icon="mdi-home"
        v-model="currentHousehold"
        :items="households"
        single-line
        item-title="householdName"
        item-value="householdId">
        <template v-slot:prepend-item>
          <v-list-item
            prepend-icon="mdi-plus"
            title="Lag ny husstand"
            @click="$router.push({ name: 'household-create' })">
          </v-list-item>
          <hr />
        </template>
      </v-select>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import router from '@/router';

const userStore = useUserInfoStore();
const householdStore = useHouseholdStore();

const currentHousehold = ref(householdStore.getSelectedId);
const households = computed(() => householdStore.households);

watch(currentHousehold, (newHousehold) => {
  router.push({ name: 'household-detail', params: { id: newHousehold } });
});
</script>
