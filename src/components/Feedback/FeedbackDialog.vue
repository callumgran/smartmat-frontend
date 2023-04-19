<template>
  <v-snackbar
    v-for="(alert, index) in $props.feedbacks"
    :key="index"
    variant="tonal"
    multi-line
    :timeout="getTimeout(index)"
    :model-value="hasFeedback(index)"
    @update:model-value="removeFeedback(index)"
    data-testid="feedback-dialog">
    <v-alert
      @click:close="removeFeedback(index)"
      closable
      :type="alert.type"
      :border="true"
      data-testid="feedback-alert"
      >{{ alert.message }}</v-alert
    >
  </v-snackbar>
</template>

<script setup lang="ts">
import { FeedbackType } from '@/stores/FeedbackStore';

const props = defineProps<{
  feedbacks: { type: FeedbackType; message: string }[];
}>();

const emit = defineEmits(['update:removeFeedback']);

const removeFeedback = (index: number) => {
  emit('update:removeFeedback', index);
};

const hasFeedback = (index: number): boolean => {
  return props.feedbacks.length > index;
};

const getTimeout = (index: number): number => {
  return 4000 * (props.feedbacks.length - index);
};
</script>
