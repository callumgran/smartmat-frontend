import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import HouseholdMembersEdit from '@/components/Household/HouseholdMembersEdit.vue';
import { VueWrapper } from '@vue/test-utils';
import { HouseholdMemberDTO } from '@/api';

describe('Test HouseholdMembersEdit', () => {
  const testDataMembers = [
    {
      username: 'user1',
      email: 'user1@example.com',
      firstName: 'User',
      lastName: 'One',
      householdRole: 'MEMBER',
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      firstName: 'User',
      lastName: 'Two',
      householdRole: 'OWNER',
    },
  ] as HouseholdMemberDTO[];

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: HouseholdMembersEdit,
      options: {
        props: {
          members: testDataMembers,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component renders member usernames', () => {
    testDataMembers.forEach((member) => {
      if (member.householdRole !== 'OWNER') {
        const usernameElement = wrapper.find(`[data-testid="${member.username}"]`);
        expect(usernameElement.text()).toBe(member.username);
      }
    });
  });
});
