import { expect, describe, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserInfoStore } from '@/stores/UserStore';
import WeeklyMenuView from '../WeeklyMenuView.vue';
import { shallowMountWithVuetify } from '@/testUtils';
import { VueWrapper } from '@vue/test-utils';

describe('Test weekly menu view', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Test weekly menu view renders', () => {
    wrapper = shallowMountWithVuetify({ component: WeeklyMenuView });
    expect(wrapper.find('[data-testid="weekly-menu"]').exists()).toBeTruthy();
  });
});
