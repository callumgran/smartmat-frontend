<template>
  <h1>Mine husstander</h1>
  <div v-for="household in households" :key="household.id">
    <h2 :data-testid="household.name" @click="onHouseholdClick(household)">
      {{ household.name }}
    </h2>
  </div>

  <div>
    <v-btn class="me-4" data-testid="create-household-button" to="/household/create">
      Opprett ny husstand
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdService, HouseholdDTO, ApiError } from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { useRouter } from 'vue-router';

const userStore = useUserInfoStore();
const username = userStore.username;
const households = ref<HouseholdDTO[]>([]);
const router = useRouter();

const onHouseholdClick = (household: HouseholdDTO) => {
  console.log(household);
  router.push({ name: 'household-detail', params: { id: household.id } });
  useHouseholdStore().setHousehold(household);
};

HouseholdService.getHouseholdsForUser({ username: username }).then((result) => {
  households.value = result;
});
</script>
