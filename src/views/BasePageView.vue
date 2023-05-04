<template>
  <BackgroundAnimation class="animated-background" />
  <div class="foreground">
    <base-header />
    <v-main class="d-flex justify-center">
      <v-container class="width-limit">
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <v-progress-linear indeterminate color="primary" />
          </template>
        </Suspense>
        <bottom-navigation />
      </v-container>
    </v-main>
    <error-dialog :feedbacks="feedbackStore.feedbacks" @update:removeFeedback="removeFeedback" />
  </div>
</template>

<script setup lang="ts">
import BaseHeader from '@/components/BasePage/Header.vue';
import ErrorDialog from '@/components/Feedback/FeedbackDialog.vue';
import useFeedbackStore from '@/stores/FeedbackStore';
import { onErrorCaptured } from 'vue';
import { handleUnknownError } from '@/components/Feedback/unknownErrorHandler';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';
import BottomNavigation from '@/components/BasePage/BottomNavigation.vue';
import BackgroundAnimation from '@/components/BasePage/BackgroundAnimation.vue';

const router = useRouter();
const feedbackStore = useFeedbackStore();

function handleError(err: Error) {
  const responseError = handleUnknownError(err);
  if (responseError === null) {
    return;
  }
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
<style scoped>
.width-limit {
  max-width: min(700px, 100%);
  min-height: 100%;
  background-color: white;
}

main {
  min-height: 100%;
}

.animated-background {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.foreground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
