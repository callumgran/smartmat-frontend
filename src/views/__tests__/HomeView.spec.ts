import { expect, describe, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserInfoStore } from '@/stores/UserStore';
import HomeView from '../HomeView.vue';
import { shallowMountWithVuetify } from '@/testUtils';
import { VueWrapper } from '@vue/test-utils';

describe('Test home view', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Test HomeView shows log in page for not logged in user', () => {
    wrapper = shallowMountWithVuetify({ component: HomeView });
    expect(wrapper.find('[data-testid="landing-page"]').exists()).toBeTruthy();
  });
});
