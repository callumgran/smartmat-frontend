import { describe, test, expect, beforeEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import FeedbackDialog from '@/components/Feedback/FeedbackDialog.vue';
import { setActivePinia, createPinia } from 'pinia';
import useFeedbackStore from '@/stores/FeedbackStore';

describe('Test feedback store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Initial store has an empty list', () => {
    const store = useFeedbackStore();
    expect(store.feedbacks).toEqual([]);
  });

  test('Adding feedback to store action adds to the list of feedbacks', () => {
    const store = useFeedbackStore();
    store.addFeedback('Message', 'success');
    expect(store.feedbacks).toEqual([{ type: 'success', message: 'Message' }]);
  });

  test('Getting the first feedback retrieves the first one added', () => {
    const store = useFeedbackStore();
    store.addFeedback('First message', 'success');
    store.addFeedback('Second message', 'success');
    expect(store.getFirstFeedback).toEqual({ type: 'success', message: 'First message' });
  });

  test('Getting the last feedback retrieves the last one added', () => {
    const store = useFeedbackStore();
    store.addFeedback('First message', 'success');
    store.addFeedback('Second message', 'success');
    store.addFeedback('Third message', 'success');
    expect(store.getLastFeedback).toEqual({ type: 'success', message: 'Third message' });
  });

  test('Removing feedback at index 0 removes the will make the first feedback the second one added', () => {
    const store = useFeedbackStore();
    store.addFeedback('First message', 'success');
    store.addFeedback('Second message', 'success');
    store.addFeedback('Third message', 'success');
    store.removeFeedback(0);
    expect(store.getFirstFeedback).toEqual({ type: 'success', message: 'Second message' });
  });
});
