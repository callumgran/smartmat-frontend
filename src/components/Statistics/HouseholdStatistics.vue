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
          :title="`Kumulativt kroner spart siden ${getMonthAndYear(earliestDate)}`"
          :data="{
            labels: monthLabels,
            datasets: [
              {
                label: `Kroner spart siden ${getMonthAndYear(earliestDate)}`,
                data: cumulativeMoneySaved,
                borderColor: '#21DB1E',
                backgroundColor: '#21DB1E',
              },
            ],
          }" />
      </v-col>
      <v-col class="chart" v-if="kilosSavedPoints.length > 0">
        <bar-stat-chart
          :title="`Kilogram spart siden ${getMonthAndYear(earliestDate)}`"
          :data="{
            labels: monthLabels,
            datasets: [
              {
                label: `Kilogram spart siden ${getMonthAndYear(earliestDate)}`,
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
                label: 'Kilogram kastet',
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
import { differenceInDays, format } from 'date-fns';

const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};
const today = new Date();

const getMonthAndYear = (date?: Date): string => {
  if (date === undefined) return '';
  return `${NorwegianMonthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const props = defineProps<{
  household: HouseholdDTO;
  productHistory: FoodProductHistoryDTO[];
}>();

// Get total waste and saved from first waste
const totalWaste = await StatsService.getTotalWasteForHousehold({
  householdId: props.household.id,
});
const firstProduct = ref(undefined as FoodProductHistoryDTO | undefined);
try {
  firstProduct.value = await StatsService.getFirstWasteForHousehold({
    householdId: props.household.id,
  });
} catch (e) {}

const earliestDate = computed(() => new Date(firstProduct.value?.date ?? today));

const getMemberAmountOrOne = () => {
  return props.household.members?.length ?? 1;
};

const cumulativeMoneySaved = ref([] as number[]);
const kilosSavedPoints = ref([] as number[]);

const kilosSavedByHousehold = computed(() => {
  const averageWasted =
    ConsumptionConstants.DAILY_WASTED_PER_HOUSEHOLD *
    getMemberAmountOrOne() *
    (differenceInDays(today, earliestDate.value) + 1); // +1 to include today
  const averageDeviation = averageWasted - totalWaste;
  return averageDeviation < 0 ? 0 : averageDeviation;
});

const wasteByMonthList = await StatsService.getWasteByMonthInPeriod({
  householdId: props.household.id,
  startDate: format(earliestDate.value, 'yyyy-MM-dd'),
  endDate: format(today, 'yyyy-MM-dd'),
});

const monthLabels = wasteByMonthList.map((wasteByMonth) => {
  return NorwegianMonthNames[wasteByMonth.month - 1];
});

const averageMonthlyWaste =
  getMemberAmountOrOne() * ConsumptionConstants.MONTHLY_WASTED_PER_HOUSEHOLD;

// Get coumulated money saved and kilos saved for each month
const thisMonthWaste = wasteByMonthList.splice(wasteByMonthList.length - 1);
wasteByMonthList.forEach((wasteByMonth) => {
  const kilosSaved = averageMonthlyWaste - wasteByMonth.waste;
  const moneySaved = kilosSaved * ConsumptionConstants.PRICE_PER_KILO;
  cumulativeMoneySaved.value.push(
    (cumulativeMoneySaved.value.at(-1) ?? 0) + (moneySaved < 0 ? 0 : moneySaved),
  );
  kilosSavedPoints.value.push(kilosSaved < 0 ? 0 : kilosSaved);
});

const daysCalculated = Math.min(differenceInDays(today, earliestDate.value) + 1, today.getDate()); // +1 to include today;
const kilosSavedThisMonth =
  ConsumptionConstants.DAILY_WASTED_PER_HOUSEHOLD * getMemberAmountOrOne() * daysCalculated -
  (thisMonthWaste.at(0)?.waste ?? 0);
const moneySavedThisMonth = kilosSavedThisMonth * ConsumptionConstants.PRICE_PER_KILO;
cumulativeMoneySaved.value.push(
  (cumulativeMoneySaved.value.at(-1) ?? 0) + (moneySavedThisMonth < 0 ? 0 : moneySavedThisMonth),
);
kilosSavedPoints.value.push(kilosSavedThisMonth < 0 ? 0 : kilosSavedThisMonth);

// Get kilos wasted per food product
const foodProductMap = new Map<string, number>();
let foodProductNames = [] as string[];
let foodProductAmounts = [] as number[];
watchEffect(() => {
  props.productHistory.forEach((product) => {
    if (product.amount * product.thrownAmountInPercentage > 0) {
      foodProductMap.set(
        product.foodProduct.name,
        (foodProductMap.get(product.foodProduct.name) ?? 0) +
          product.amount * product.thrownAmountInPercentage,
      );
    }
  });
  foodProductNames = Array.from(foodProductMap.keys());
  foodProductAmounts = Array.from(foodProductMap.values());
});
</script>

<style scoped>
.chart {
  justify-content: center;
  display: flex;
}
</style>
