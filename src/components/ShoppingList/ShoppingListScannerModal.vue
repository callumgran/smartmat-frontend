<template>
  <div class="d-flex justify-center flex-column align-center">
    <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
    <v-progress-circular indeterminate :size="60" v-if="scannerLoading"></v-progress-circular>
    <v-btn @click="close">Avbryt</v-btn>
  </div>
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
