<template>
  <h2 style="text-align: center" data-testid="name">{{ household.name }}</h2>

  <div class="d-flex justify-center align-center header">
    <v-btn-toggle v-model="pageComponent" mandatory divided variant="outlined" color="primary">
      <v-btn value="members" size="x-small" data-testid="members-btn">Medlemmer</v-btn>
      <v-btn value="inventory" size="x-small" data-testid="inventory-btn">Beholdning</v-btn>
      <v-btn v-if="hasAccessToEdit" value="settings" size="x-small" data-testid="settings-btn"
        >Innstillinger</v-btn
      >
    </v-btn-toggle>
  </div>

  <div v-if="pageComponent === 'members'">
    <h3>Medlemmer ({{ household.members?.length }})</h3>
    <household-members :household-members="household.members ?? []" />
  </div>

  <div v-else-if="pageComponent === 'inventory'">
    <inventory-list :household="household" />
  </div>

  <div v-else>
    <household-settings
      :household="household"
      @delete-household="deleteHousehold()"
      @update-name="(newName) => updateName(newName)"
      @add-member="(username) => addMember(username)"
      @remove-member="(username) => removeMember(username)"
      @update-member-role="(username, role) => updateMemberRole(username, role)" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HouseholdDTO, HouseholdMemberDTO, HouseholdService } from '@/api';
import { useUserInfoStore } from '@/stores/UserStore';
import useFeedbackStore from '@/stores/FeedbackStore';
import HouseholdMembers from '@/components/Household/HouseholdMembers.vue';
import InventoryList from '@/components/Household/Inventory/InventoryList.vue';
import HouseholdSettings from '@/components/Household/HouseholdSettings.vue';

const feedbackStore = useFeedbackStore();
const router = useRouter();
const route = useRoute();
const id = route.params.id as string;
const userStore = useUserInfoStore();
const username = userStore.username;

const household = ref<HouseholdDTO>({} as HouseholdDTO);
household.value = await HouseholdService.getHousehold({ id: id });

const pageComponent = ref('members');

const hasAccessToEdit = computed(() => {
  const r = household.value.members?.find((member) => member.username === username)?.householdRole;
  if (r === undefined) {
    return false;
  }
  return (
    r === HouseholdMemberDTO.householdRole.OWNER ||
    r === HouseholdMemberDTO.householdRole.PRIVILEGED_MEMBER
  );
});

/* functions */
const deleteHousehold = async () => {
  const rc = confirm('Er du sikker på at du vil slette husholdningen?');
  if (!rc) return;
  await HouseholdService.deleteHousehold({ id: household.value.id });
  feedbackStore.addFeedback('Husholdningen ble slettet', 'success');
  router.push({ name: 'household' });
};

const updateName = async (newName: string) => {
  await HouseholdService.updateHouseholdName({
    requestBody: { id: household.value.id, name: newName },
  });
  household.value.name = newName;
  feedbackStore.addFeedback('Navnet ble oppdatert', 'success');
};

const addMember = async (username: string) => {
  const newMember = await HouseholdService.addUserToHousehold({
    id: household.value.id,
    username: username,
  });
  household.value.members?.push(newMember);
};

const removeMember = async (username: string) => {
  await HouseholdService.removeUserFromHousehold({ id: household.value.id, username: username });
  household.value.members = household.value?.members?.filter(
    (member) => member.username !== username,
  );
};

const updateMemberRole = async (username: string, role: HouseholdMemberDTO.householdRole) => {
  await HouseholdService.updateUserInHousehold({
    id: household.value.id,
    username: username,
    requestBody: role,
  });

  feedbackStore.addFeedback(`Rollen til ${username} ble oppdatert`, 'success');
};
</script>

<style scoped>
.header {
  margin-bottom: 1rem;
}
</style>
