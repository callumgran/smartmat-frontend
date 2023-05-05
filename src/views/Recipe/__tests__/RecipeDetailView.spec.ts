import { expect, describe, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserInfoStore } from '@/stores/UserStore';
import RecipeDetailView from '../RecipeDetailView.vue';
import { shallowMountWithVuetify } from '@/testUtils';
import { VueWrapper } from '@vue/test-utils';

describe('Test recipe detail view', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Test recipe detail view renders', () => {
    wrapper = shallowMountWithVuetify({ component: RecipeDetailView });
    expect(wrapper.find('[data-testid="recipe-detail"]').exists()).toBeTruthy();
  });
});
