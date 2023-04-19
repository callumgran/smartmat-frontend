import { describe, test, expect, beforeEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import FeedbackDialog from '@/components/Feedback/FeedbackDialog.vue';
import { setActivePinia, createPinia } from 'pinia';
import useFeedbackStore from '@/stores/FeedbackStore';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import { VApp, VSnackbar } from 'vuetify/components';
import { h } from 'vue';
import { mount } from '@vue/test-utils';

describe('Test feedback dialog', () => {
  test('Dialog is not visible by default', () => {
    const wrapper = mountWithVuetify({
      component: FeedbackDialog,
      options: {
        props: {
          feedbacks: [],
        },
      },
    });
    expect(wrapper.findComponent(VSnackbar).exists()).toBe(false);
  });

  test('Dialog with feedback as prop is visible', () => {
    const wrapper = mountWithVuetify({
      component: FeedbackDialog,
      options: {
        props: {
          feedbacks: [{ type: 'success', message: 'Message' }],
        },
      },
    });
    expect(wrapper.findComponent(VSnackbar).exists()).toBe(true);
  });

  test('renders the feedback dialog', () => {
    const vuetify = createVuetify();

    const wrapper = mount(VApp, {
      slots: {
        default: h(FeedbackDialog, { feedbacks: [{ type: 'success', message: 'Message' }] }),
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.findComponent(VSnackbar).exists()).toBe(true);
  });
});
