<template>
  <base-header />
  <v-main>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
  <error-dialog :feedbacks="feedbackStore.feedbacks" @update:removeFeedback="removeFeedback" />
  <base-footer />
</template>

<script setup lang="ts">
import BaseHeader from '@/components/BasePage/Header.vue';
import ErrorDialog from '@/components/Feedback/FeedbackDialog.vue';
import BaseFooter from '@/components/BasePage/Footer.vue';
import useFeedbackStore from '@/stores/FeedbackStore';
import { onErrorCaptured } from 'vue';
import handleUnknownError from '@/components/Feedback/unknownErrorHandler';

const feedbackStore = useFeedbackStore();

onErrorCaptured((err) => {
  let errorMessage = handleUnknownError(err);
  feedbackStore.addFeedback(errorMessage, 'error');
  return false;
});

const removeFeedback = (index: number) => {
  feedbackStore.removeFeedback(index);
};

window.addEventListener('unhandledrejection', (event) => {
  let errorMessage = handleUnknownError(event.reason);
  feedbackStore.addFeedback(errorMessage, 'error');
  Promise.resolve(event.reason);
});
</script>
