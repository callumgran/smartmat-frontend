<template>
  <div class="wrapper">
    <h3
      :data-testid="household.name"
      @click="$router.push({ name: 'household-detail', params: { id: household.id } })">
      {{ household.name }}
    </h3>
    <v-btn rounded="xl" :to="{ name: 'household-inventory', params: { id: household.id } }"
      >beholdning
      <v-icon icon="mdi-food-apple" />
    </v-btn>
  </div>
  {{ role }}
  <v-divider />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HouseholdDTO } from '@/api';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdMemberRole } from '@/utils/EnumTranslation';

const userStore = useUserInfoStore();
const username = userStore.username;

const props = defineProps({
  household: {
    type: Object as () => HouseholdDTO,
    required: true,
  },
});

const role = computed(() => {
  const r = props.household.members?.find((member) => member.username === username)?.householdRole;
  return HouseholdMemberRole[r as keyof typeof HouseholdMemberRole];
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}
</style>
