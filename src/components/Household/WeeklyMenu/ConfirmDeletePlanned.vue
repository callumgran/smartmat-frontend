<template>
  <v-dialog v-model="showModal" max-width="500" class="dialog">
    <v-card data-testid="modal-dialog">
      <v-card-item
        ><h3 data-testid="confirmation-message">
          Er du sikker på at du vil fjerne den planlagte oppskriften?
        </h3></v-card-item
      >
      <v-card-actions>
        <v-btn @click="onClick(true)">Ja</v-btn>
        <v-btn color="primary" @click="onClick(false)">Nei</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(true);
const emit = defineEmits(['confirmDelete']);

const onClick = (yes: boolean) => {
  showModal.value = false;
  emit('confirmDelete', yes);
};
</script>
