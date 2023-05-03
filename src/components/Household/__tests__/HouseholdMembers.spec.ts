import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import HouseholdMembers from '@/components/Household/HouseholdMembers.vue';
import MemberCard from '@/components/Household/MemberCard.vue';
import { VueWrapper } from '@vue/test-utils';
import { HouseholdMemberDTO } from '@/api';
import householdRole = HouseholdMemberDTO.householdRole;

describe('Test HouseholdMembers', () => {
  const householdMembers: HouseholdMemberDTO[] = [
    {
      household: 'household1',
      username: 'user1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      householdRole: householdRole.OWNER,
    },
    {
      household: 'household1',
      username: 'user2',
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      householdRole: householdRole.MEMBER,
    },
  ];

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: HouseholdMembers,
      options: {
        props: {
          householdMembers,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Test if the component renders the correct number of MemberCard components', () => {
    const memberCards = wrapper.findAllComponents(MemberCard);
    expect(memberCards.length).toBe(householdMembers.length);
  });

  test('Test if the component passes the correct props to each MemberCard component', () => {
    const memberCards = wrapper.findAllComponents(MemberCard);
    memberCards.forEach((memberCard, index) => {
      expect(memberCard.props().member).toEqual(householdMembers[index]);
    });
  });
});
