-- Get totaled saved by tallying up every household the user is a part of
<template>
  <total-saved :kilos-saved="kilosSaved" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { FoodProductHistoryDTO, HouseholdService, StatsService } from '@/api';
import TotalSaved from '@/components/Statistics/TotalSaved.vue';
import { ConsumptionConstants } from '@/utils/ConsumptionConstants';
import { differenceInMonths } from 'date-fns';

const userInfoStore = useUserInfoStore();
const username = userInfoStore.username;
const kilosSaved = ref(0);

const today = new Date();

const getWastedForMemberAmount = (members: number) => {
  return ConsumptionConstants.MONTHLY_WASTED_PER_HOUSEHOLD * members;
};

const households = await HouseholdService.getHouseholdsForUser({ username: username });
for (const household of households) {
  let firstProduct: FoodProductHistoryDTO;
  try {
    firstProduct = await StatsService.getFirstWasteForHousehold({
      householdId: household.id,
    });
  } catch (e) {
    continue;
  }
  const firstDate = new Date(firstProduct.date);
  const monthsDifference = differenceInMonths(today, firstDate) + 1;
  const totalAverageWasted =
    getWastedForMemberAmount(household.members?.length ?? 1) * monthsDifference;
  const saved =
    totalAverageWasted -
    (await StatsService.getTotalWasteForHousehold({ householdId: household.id }));
  kilosSaved.value += saved < 0 ? 0 : saved;
}
</script>
