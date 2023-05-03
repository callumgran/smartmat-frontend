import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import InventoryList from '@/components/Household/Inventory/InventoryList.vue';
import { VueWrapper } from '@vue/test-utils';
import { HouseholdDTO, HouseholdFoodProductDTO, HouseholdMemberDTO } from '@/api';

describe('test InventoryList', () => {
  const testData = {
    household: {
      id: '1',
      name: 'Test Household',
      members: [
        {
          username: 'user1',
          householdRole: 'OWNER',
          firstName: 'simen',
          lastName: 'johan',
          email: 'example@live.no',
          household: '1',
        },
        {
          username: 'user2',
          householdRole: 'MEMBER',
          firstName: 'petter',
          lastName: 'johansen',
          email: 'petter@live.no',
          household: '1',
        },
      ],
      foodProducts: [
        {
          id: '1',
          foodProduct: {
            id: 1,
            name: 'Apple',
          },
          amountLeft: 5,
          expirationDate: '2023-06-01',
          householdId: '1',
        },
        {
          id: '2',
          foodProduct: {
            id: 2,
            name: 'Banana',
          },
          amountLeft: 8,
          expirationDate: '2023-06-10',
          householdId: '1',
        },
        {
          id: '3',
          foodProduct: {
            id: 3,
            name: 'Carrot',
          },
          amountLeft: 10,
          expirationDate: '2023-07-01',
          householdId: '1',
        },
      ] as HouseholdFoodProductDTO[],
    } as HouseholdDTO,
  };

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: InventoryList,
      options: {
        props: testData,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component displays all food products in household', () => {
    const foodProductCards = wrapper.findAll('[data-testid="inventory-table"]');
    expect(foodProductCards.length).toBe(3);
  });

  test('Search functionality works', async () => {
    const searchInput = wrapper.find('.v-input__control input');
    await searchInput.setValue('Banana');

    const foodProductCards = wrapper.findAll('[data-testid="inventory-table"]');
    expect(foodProductCards.length).toBe(1);
  });

  test('Filter functionality works', async () => {
    const sortByAmountButton = wrapper.find('[data-testid="sort-by-amount"]');
    await sortByAmountButton.trigger('click');

    const foodProductCards = wrapper.findAll('[data-testid="inventory-table"]');
    const fpCardComponent0 = foodProductCards[0].getComponent({ name: 'HouseholdFoodProductCard' });
    const fpCardComponent1 = foodProductCards[1].getComponent({ name: 'HouseholdFoodProductCard' });
    const fpCardComponent2 = foodProductCards[2].getComponent({ name: 'HouseholdFoodProductCard' });
    expect(fpCardComponent0.props().hfProduct.amountLeft).toBe(10);
    expect(fpCardComponent1.props().hfProduct.amountLeft).toBe(8);
    expect(fpCardComponent2.props().hfProduct.amountLeft).toBe(5);
  });
});
