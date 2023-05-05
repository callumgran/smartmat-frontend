import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import CreateHouseholdView from '@/views/Household/CreateHouseholdView.vue';
import { VueWrapper } from '@vue/test-utils';

describe('Test CreateHouseholdView', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: CreateHouseholdView,
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component renders title', () => {
    const title = wrapper.find('h1');
    expect(title.text()).toBe('Opprett ny husstand');
  });

  test('Component renders name input field', () => {
    const inputField = wrapper.find('[data-testid="name"]');
    expect(inputField.exists()).toBeTruthy();
  });

  test('Component renders create household button', () => {
    const createButton = wrapper.find('[data-testid="create-household-button"]');
    expect(createButton.exists()).toBeTruthy();
  });
});
