<template>
  <div v-for="member in members" :key="member.username">
    <div v-if="member.householdRole != 'OWNER'">
      <div class="household-members">
        <span style="flex-grow: 1">
          <span :data-testid="member.username">
            {{ member.username }}
          </span>
        </span>
        <v-btn>
          <v-icon icon="mdi:mdi-account-minus" @click="removeMember(member.username)" />
        </v-btn>
      </div>

      <v-radio-group
        v-model="member.householdRole"
        @update:model-value="updateMemberRole(member.username, member.householdRole)">
        <v-radio label="Med-eier" value="PRIVILEGED_MEMBER"></v-radio>
        <v-radio label="Bruker" value="MEMBER"></v-radio>
      </v-radio-group>
      <v-divider class="my-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HouseholdMemberDTO } from '@/api';

defineProps({
  members: {
    type: Array as () => HouseholdMemberDTO[],
    required: true,
  },
});

const emits = defineEmits(['remove-member', 'update-member-role']);

const removeMember = async (username: string) => {
  emits('remove-member', username);
};

const updateMemberRole = async (username: string, role: string) => {
  emits('update-member-role', username, role);
};
</script>

<style scoped>
.household-members {
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
