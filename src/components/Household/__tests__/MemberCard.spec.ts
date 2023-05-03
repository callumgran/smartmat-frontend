import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import MemberCard from '@/components/Household/MemberCard.vue';
import { VueWrapper } from '@vue/test-utils';
import { HouseholdMemberDTO } from '@/api';
import householdRole = HouseholdMemberDTO.householdRole;

describe('Test MemberCard', () => {
  const member = {
    household: 'household1',
    username: 'user1',
    email: 'user1@example.com',
    firstName: 'John',
    lastName: 'Doe',
    householdRole: householdRole.OWNER,
  };

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: MemberCard,
      options: {
        props: {
          member,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component renders member name', () => {
    const name = wrapper.find('[data-testid="user1"]');
    expect(name.text()).toBe('John Doe');
  });

  test('Component renders member email', () => {
    const email = wrapper.find('.mail');
    expect(email.text()).toBe('user1@example.com');
  });

  test('Component shows correct icon for member role', () => {
    const icon = wrapper.find('i');
    expect(icon.classes()).toContain('mdi-crown');
  });
});
