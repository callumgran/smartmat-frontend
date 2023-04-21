import { defineStore } from 'pinia';

export type FeedbackType = 'error' | 'success' | 'info' | 'warning';

export type Feedback = {
  message: string;
  type: FeedbackType;
};

export default defineStore('FeedbackStore', {
  state: () => ({
    feedbacks: [] as Feedback[],
  }),
  actions: {
    addFeedback(message: string, type: FeedbackType) {
      this.feedbacks.push({ message, type });
    },
    removeFeedback(index: number) {
      this.feedbacks.splice(index, 1);
    },
    clearFeedbacks() {
      this.feedbacks = [];
    },
  },
  getters: {
    getFirstFeedback(): Feedback | undefined {
      if (this.feedbacks.length > 0) {
        return this.feedbacks[0];
      }
      return undefined;
    },
    getLastFeedback(): Feedback | undefined {
      if (this.feedbacks.length > 0) {
        return this.feedbacks[this.feedbacks.length - 1];
      }
      return undefined;
    },
  },
});
