<template>
  <v-card class="d-flex justify-center flex-column align-center">
    <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
    <v-progress-circular
      class="scanner-size"
      indeterminate
      :size="60"
      v-if="scannerLoading"></v-progress-circular>
    <v-btn @click="close">Avbryt</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { StreamBarcodeReader } from 'vue-barcode-reader';
import { ref } from 'vue';

const scannerLoading = ref(true);

const emit = defineEmits<{
  (e: 'onScan', ean: string): void;
  (e: 'onClose'): void;
}>();

const close = () => {
  emit('onClose');
};
const onLoaded = () => {
  console.log('Loaded');
  scannerLoading.value = false;
};
const onDecode = (result: string) => {
  console.log(result);
  emit('onScan', result);
};
</script>

<style scoped>
.scanner-size {
  width: min(70vw, 500px);
  height: min(60vw, 400px);
}
</style>
