import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import HouseholdFoodProductCard from '@/components/Household/HouseholdFoodProductCard.vue';
import { VueWrapper } from '@vue/test-utils';
import { HouseholdFoodProductDTO } from '@/api';

describe('Test HouseholdFoodProductCard', () => {
  const testDataProduct = {
    id: '1',
    foodProduct: {
      id: 1,
      name: 'Apple',
    },
    amountLeft: 5,
    expirationDate: '2023-06-01',
    householdId: '1',
  } as HouseholdFoodProductDTO;

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: HouseholdFoodProductCard,
      options: {
        props: {
          hfProduct: testDataProduct,
          hasAccessToEdit: true,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component renders food product name', () => {
    const title = wrapper.find('[data-testid="1"]');
    expect(title.text()).toBe('Apple');
  });
});
