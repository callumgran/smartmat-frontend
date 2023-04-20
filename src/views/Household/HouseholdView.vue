<template>
  <h1>Mine husstander</h1>
  <div v-for="household in households" :key="household.id">
    <h2 :data-testid="household.name">{{ household.name }}</h2>
  </div>

  <div>
    <v-btn class="me-4" data-testid="create-household-button" to="/household/create">
      Opprett ny husstand
    </v-btn>
  </div>
  <div>
    <v-btn class="me-4" data-testid="join-household-button" to="/household/join">
      Bli medlem av en husstand
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdService, HouseholdDTO, ApiError } from '@/api';

const userStore = useUserInfoStore();
const username = userStore.username;
const households = ref<HouseholdDTO[]>([]);

HouseholdService.getHouseholdsForUser({ username: username }).then((result) => {
  households.value = result;
});
</script>
