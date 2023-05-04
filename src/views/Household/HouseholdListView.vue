<template>
  <h2 style="text-align: center">Mine husstander</h2>
  <v-btn color="primary" class="me-4" data-testid="create-household-button" to="/household/create">
    <v-icon icon="mdi:mdi-plus" />
  </v-btn>

  <div class="household-list">
    <div
      v-for="household in households"
      :key="household.id"
      @click="onHouseholdClick(household)"
      class="household-brief"
      :data-testid="household.id">
      {{ household.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdService, HouseholdDTO } from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { useRouter } from 'vue-router';

const userStore = useUserInfoStore();
const username = userStore.username;
const households = ref<HouseholdDTO[]>([]);
const router = useRouter();

const onHouseholdClick = (household: HouseholdDTO) => {
  router.push({ name: 'household-detail', params: { id: household.id } });
  useHouseholdStore().selectHouseholdById(household.id);
};

HouseholdService.getHouseholdsForUser({ username: username }).then((result) => {
  households.value = result;
});
</script>

<style scoped>
.household-brief {
  margin-top: 1rem;
  border: 1px solid black;
  border-radius: 10%;
  text-align: center;
  width: 275px;
  padding: 1rem;
}

.household-brief:hover {
  cursor: pointer;
}

.household-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
