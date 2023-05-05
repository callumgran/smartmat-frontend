import { expect, describe, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserInfoStore } from '@/stores/UserStore';
import ShoppingTripView from '../ShoppingTripView.vue';
import { shallowMountWithVuetify } from '@/testUtils';
import { VueWrapper } from '@vue/test-utils';

describe('Test shopping trip view', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Test shopping trip view renders', () => {
    wrapper = shallowMountWithVuetify({ component: ShoppingTripView });
    expect(wrapper.find('[data-testid="loading"]').exists()).toBeTruthy();
  });
});
