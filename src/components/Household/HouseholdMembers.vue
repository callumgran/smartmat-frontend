<template>
  <h3>Medlemmer</h3>
  <v-divider class="my-4" />
  <div v-for="member in household?.members" :key="member.username">
    <div class="household-members">
      <span style="flex-grow: 1">
        <p :data-testid="member.username">
          {{ member.username }}
        </p>
        <v-icon
          v-if="member.householdRole === ('OWNER' || 'PRIVILEGED_MEMBER')"
          icon="mdi:mdi-crown" />
      </span>
      <v-btn v-if="isSuperUser && member.householdRole != 'OWNER'">
        <v-icon icon="mdi:mdi-account-minus" @click="removeMember(member.username)" />
      </v-btn>
    </div>
    <v-divider class="my-4" />
  </div>
</template>

<script setup lang="ts">
import { HouseholdDTO } from '@/api';

const props = defineProps({
  household: {
    type: Object as () => HouseholdDTO,
    required: true,
  },
  isSuperUser: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['remove-member']);

const removeMember = async (username: string) => {
  emits('remove-member', username);
};
</script>

<style scoped>
.household-members {
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
