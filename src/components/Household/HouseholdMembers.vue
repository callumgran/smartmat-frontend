<template>
  <h3>Medlemmer</h3>
  <v-divider class="my-4" />
  <div v-for="member in household?.members" :key="member.username">
    <div class="household-members">
      <span style="flex-grow: 1">
        <span :data-testid="member.username">
          {{ member.username }}
        </span>
        <v-icon
          v-if="member.householdRole === ('OWNER' || 'PRIVILEGED_MEMBER')"
          icon="mdi:mdi-crown" />
      </span>
      <div v-if="editMode && member.householdRole != 'OWNER'">
        <v-btn>
          <v-icon icon="mdi:mdi-account-minus" @click="removeMember(member.username)" />
        </v-btn>
      </div>
    </div>

    <div v-if="editMode && member.householdRole != 'OWNER'">
      <v-radio-group
        v-model="member.householdRole"
        @update:model-value="updateMemberRole(member.username, member.householdRole)">
        <v-radio label="Med-eier" value="PRIVILEGED_MEMBER"></v-radio>
        <v-radio label="Bruker" value="MEMBER"></v-radio>
      </v-radio-group>
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
  editMode: {
    type: Boolean,
    default: false,
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
