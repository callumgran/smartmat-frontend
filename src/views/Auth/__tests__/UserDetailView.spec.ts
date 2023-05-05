import { expect, describe, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserInfoStore } from '@/stores/UserStore';
import UserDetailView from '../UserDetailView.vue';
import { shallowMountWithVuetify } from '@/testUtils';
import { VueWrapper } from '@vue/test-utils';

describe('Test user detail view', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Test user detail view renders', () => {
    wrapper = shallowMountWithVuetify({ component: UserDetailView });
    expect(wrapper.find('[data-testid="loading"]').exists()).toBeTruthy();
  });
});
