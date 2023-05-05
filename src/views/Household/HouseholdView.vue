<template>
  <h2 style="text-align: center" data-testid="name">{{ household.name }}</h2>

  <div class="d-flex justify-center align-center header">
    <v-btn-toggle v-model="pageComponent" mandatory divided variant="outlined" color="primary">
      <v-btn value="inventory" data-testid="inventory-btn"><v-icon>mdi-food-apple</v-icon></v-btn>
      <v-btn value="statistics" data-testid="stats-btn"
        ><v-icon>mdi-chart-areaspline</v-icon></v-btn
      >
      <v-btn value="members" data-testid="members-btn"><v-icon>mdi-account-group</v-icon></v-btn>
      <v-btn v-if="hasAccessToEdit" value="settings" data-testid="settings-btn"
        ><v-icon>mdi-cog</v-icon></v-btn
      >
    </v-btn-toggle>
  </div>

  <suspense>
    <template #default>
      <div v-if="pageComponent === 'inventory'">
        <inventory-list :household="household" />
      </div>

      <div v-else-if="pageComponent === 'statistics'">
        <household-statistics :product-history="foodProductHistory" :household="household" />
      </div>

      <div v-else-if="pageComponent === 'members'">
        <household-members :household-members="household.members ?? []" />
      </div>

      <div v-else-if="pageComponent === 'settings'">
        <household-settings
          :household="household"
          @delete-household="deleteHousehold()"
          @update-name="(newName) => updateName(newName)"
          @add-member="(username) => addMember(username)"
          @remove-member="(username) => removeMember(username)"
          @update-member-role="(username, role) => updateMemberRole(username, role)" />
      </div>
    </template>
    <template #fallback>
      <div class="d-flex justify-center align-center">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  FoodProductHistoryDTO,
  HouseholdDTO,
  HouseholdMemberDTO,
  HouseholdService,
  UpdateHouseholdDTO,
  StatsService,
} from '@/api';
import { useUserInfoStore } from '@/stores/UserStore';
import useFeedbackStore from '@/stores/FeedbackStore';
import HouseholdMembers from '@/components/Household/HouseholdMembers.vue';
import InventoryList from '@/components/Household/Inventory/InventoryList.vue';
import HouseholdSettings from '@/components/Household/HouseholdSettings.vue';
import HouseholdStatistics from '@/components/Statistics/HouseholdStatistics.vue';
import { useHouseholdStore } from '@/stores/HouseholdStore';

const feedbackStore = useFeedbackStore();
const router = useRouter();
const route = useRoute();
const id = route.params.id as string;
const userStore = useUserInfoStore();
const username = userStore.username;

const household = ref<HouseholdDTO>({} as HouseholdDTO);
household.value = await HouseholdService.getHousehold({ id: id });

const pageComponent = ref('inventory' as 'inventory' | 'settings' | 'members' | 'statistics');

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
  useHouseholdStore().clearHousehold();
  feedbackStore.addFeedback('Husholdningen ble slettet', 'success');
  userStore.clearUserInfo();
  router.push({ name: 'login' });
};

const updateName = async (newName: string) => {
  let updateHouseholdDTO: UpdateHouseholdDTO = { name: newName, id: household.value.id };
  await HouseholdService.updateHouseholdName({
    id: household.value.id,
    requestBody: updateHouseholdDTO,
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

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return;
    household.value = await HouseholdService.getHousehold({ id: newId as string });
  },
);

const foodProductHistory = ref<FoodProductHistoryDTO[]>([]);
onMounted(async () => {
  foodProductHistory.value = await StatsService.getFoodProductHistoryForHousehold({
    householdId: household.value.id,
  });
});
</script>

<style scoped>
.header {
  margin-bottom: 1rem;
}
</style>
