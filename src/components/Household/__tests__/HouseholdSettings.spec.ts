import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import HouseholdSettings from '@/components/Household/HouseholdSettings.vue';
import { VueWrapper } from '@vue/test-utils';
import { HouseholdDTO, HouseholdMemberDTO } from '@/api';

const testHousehold = {
  id: '1',
  name: 'My Household',
  members: [
    { username: 'user1' } as HouseholdMemberDTO,
    { username: 'user2' } as HouseholdMemberDTO,
  ],
} as HouseholdDTO;

let wrapper: VueWrapper<any>;

beforeEach(() => {
  wrapper = mountWithVuetify({
    component: HouseholdSettings,
    options: {
      props: {
        household: testHousehold,
      },
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

test('Component renders add member button', () => {
  const addButton = wrapper.find('[data-testid="add-member-button"]');
  expect(addButton.exists()).toBe(true);
});

test('Component renders delete household button', () => {
  const deleteButton = wrapper.find('[data-testid="delete-household-btn"]');
  expect(deleteButton.exists()).toBe(true);
});

test('Component renders save name button', () => {
  const saveButton = wrapper.find('[data-testid="save-name-button"]');
  expect(saveButton.exists()).toBe(true);
});
