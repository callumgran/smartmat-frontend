<template>
  <h1>Mine husstander</h1>
  <div v-for="household in households" :key="household.id">
    <h2 :data-testid="household.name" @click="onHouseholdClick(household)">
      {{ household.name }}
    </h2>
  </div>

  <div>
    <v-btn class="me-4" data-testid="create-household-button" to="/household/create">
      <v-icon icon="mdi:mdi-plus" />
    </v-btn>
  </div>

  <v-divider />
  <household-brief
    class="household-list"
    v-for="household in households"
    :key="household.id"
    :household="household" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import HouseholdBrief from '@/components/Household/HouseholdBrief.vue';
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

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.household-list {
  margin-top: 1rem;
}
</style>
