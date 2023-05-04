<template>
  <div class="chart-box">
    <h3 class="text-center">{{ title }}</h3>
    <v-sheet class="chart-sheet">
      <Bar
        :data="data"
        :responsive="true"
        :options="{ maintainAspectRatio: true, responsive: true, aspectRatio: 1.5 }" />
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ChartData } from 'chart.js';
import { Bar } from 'vue-chartjs';

defineProps<{
  data: ChartData<'bar', number[]>;
  title: string;
}>();
</script>

<style scoped>
.chart-sheet {
  border: none;
  overflow: hidden;
  height: 300px;
  width: 450px;
  max-width: 100%;
}

.chart-box {
  max-width: 100%;
}
</style>
