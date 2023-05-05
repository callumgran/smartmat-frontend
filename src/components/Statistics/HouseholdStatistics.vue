<template>
  <h2 class="text-center text-h3 pa-3">Statistikk over ditt forbruk</h2>
  <h3 class="text-center" v-if="productHistory.length === 0">Du har ikke kastet noe mat!</h3>
  <div v-else>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <total-saved :kilos-saved="kilosSavedByHousehold" />
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-10">
      <v-col class="chart" v-if="cumulativeMoneySaved.length > 0">
        <line-stat-chart
          :title="`Kroner spart siden ${earliestDate?.getFullYear()}`"
          :data="{
            labels: monthsSinceStartLabels,
            datasets: [
              {
                label: `Kroner spart siden ${earliestDate?.getFullYear()}`,
                data: cumulativeMoneySaved,
                borderColor: '#21DB1E',
                backgroundColor: '#21DB1E',
              },
            ],
          }" />
      </v-col>
      <v-col class="chart" v-if="kilosSavedPoints.length > 0">
        <bar-stat-chart
          :title="`Kilogram spart siden ${earliestDate?.getFullYear()}`"
          :data="{
            labels: monthsSinceStartLabels,
            datasets: [
              {
                label: `Kilogram spart siden ${earliestDate?.getFullYear()}`,
                data: kilosSavedPoints,
                backgroundColor: '#21DB1E',
              },
            ],
          }" />
      </v-col>
      <v-col class="chart" v-if="foodProductAmounts.length > 0">
        <doughnut-stat-chart
          title="Matvarene du kaster mest av"
          :data="{
            labels: foodProductNames,
            datasets: [
              {
                label: 'Kilo kastet',
                data: foodProductAmounts,
                backgroundColor: Array.from({ length: foodProductAmounts.length }, () =>
                  getRandomColor(),
                ),
              },
            ],
          }" />
      </v-col>
    </v-row>
    <stat-info-banner />
  </div>
</template>

<script setup lang="ts">
import { FoodProductHistoryDTO, HouseholdDTO, StatsService } from '@/api';
import { computed, ref, watchEffect } from 'vue';
import TotalSaved from '@/components/Statistics/TotalSaved.vue';
import LineStatChart from '@/components/Statistics/LineStatChart.vue';
import { NorwegianMonthNames } from '@/utils/DateFormats';
import { ConsumptionConstants } from '@/utils/ConsumptionConstants';
import BarStatChart from '@/components/Statistics/BarStatChart.vue';
import DoughnutStatChart from './DoughnutStatChart.vue';
import StatInfoBanner from '@/components/Statistics/StatInfoBanner.vue';

const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const today = new Date();
const earliestDate = ref(new Date(today));

const props = defineProps<{
  household: HouseholdDTO;
  productHistory: FoodProductHistoryDTO[];
}>();

const totalWaste = await StatsService.getTotalWasteForHousehold({
  householdId: props.household.id,
});
const averageWasteSumToNow = ref(0);

const cumulativeMoneySaved = ref([] as number[]);
const monthsSinceStartLabels = ref([] as string[]);
const kilosSavedPoints = ref([] as number[]);

const selectedDate = ref(earliestDate.value);

const kilosSavedByHousehold = computed(() => {
  const averageDeviation = averageWasteSumToNow.value - totalWaste;
  return averageDeviation < 0 ? 0 : averageDeviation;
});

const getWastedForMemberAmount = () => {
  return ConsumptionConstants.MONTHLY_WASTED_PER_HOUSEHOLD * (props.household.members?.length ?? 1);
};

// Get the earliest date in the product history
selectedDate.value = props.productHistory.reduce((acc: Date, curr: FoodProductHistoryDTO) => {
  return acc < new Date(curr.date) ? acc : new Date(curr.date);
}, earliestDate.value);

while (
  selectedDate.value.getFullYear() < today.getFullYear() ||
  (selectedDate.value.getMonth() <= today.getMonth() &&
    selectedDate.value.getFullYear() == today.getFullYear())
) {
  monthsSinceStartLabels.value.push(`${NorwegianMonthNames[selectedDate.value.getMonth()]}`);

  averageWasteSumToNow.value += getWastedForMemberAmount();
  const wasteInMonth = await StatsService.getTotalWasteForHouseholdAndYearAndMonth({
    householdId: props.household.id,
    month: selectedDate.value.getMonth() + 1,
    year: selectedDate.value.getFullYear(),
  });
  const kilosSaved = getWastedForMemberAmount() - wasteInMonth;
  kilosSavedPoints.value.push(kilosSaved < 0 ? 0 : kilosSaved);
  const moneySaved = kilosSaved * ConsumptionConstants.PRICE_PER_KILO;
  cumulativeMoneySaved.value.push(
    (cumulativeMoneySaved.value.at(-1) ?? 0) + (moneySaved < 0 ? 0 : moneySaved),
  );

  selectedDate.value.setMonth(selectedDate.value.getMonth() + 1);
}

const foodProductMap = new Map<string, number>();
watchEffect(() => {
  props.productHistory.forEach((product) => {
    foodProductMap.set(
      product.foodProduct.name,
      (foodProductMap.get(product.foodProduct.name) ?? 0) +
        product.amount * product.thrownAmountInPercentage,
    );
  });
});

const foodProductNames = computed(() => Array.from(foodProductMap.keys()));
const foodProductAmounts = computed(() => Array.from(foodProductMap.values()));
</script>

<style scoped>
.chart {
  justify-content: center;
  display: flex;
}
</style>
