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
import { handleUnknownError, ResponseError } from '@/components/Feedback/unknownErrorHandler';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';

const router = useRouter();
const feedbackStore = useFeedbackStore();

function handleError(err: Error) {
  const responseError = handleUnknownError(err);
  if (responseError.statusCode === 401) {
    useUserInfoStore().clearUserInfo();
    router.push({ name: 'login', query: { errorMsg: responseError.message } });
  } else {
    feedbackStore.addFeedback(responseError.message, 'error');
  }
}

onErrorCaptured((err) => {
  handleError(err);
  return false;
});

const removeFeedback = (index: number) => {
  feedbackStore.removeFeedback(index);
};

window.addEventListener('unhandledrejection', (event) => {
  handleError(event.reason);
  Promise.resolve(event.reason);
});
</script>
