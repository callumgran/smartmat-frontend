import { describe, test, expect } from 'vitest';
import mountWithVuetify from '@/testUtils';
import ShoppingListSimpleCard from '@/components/ShoppingList/ShoppingListSimpleCard.vue';
import { ListingShoppingListDTO } from '@/api';

describe('Date completed', () => {
  test('shown when shopping list date completed is defined', async () => {
    const wrapper = mountWithVuetify({
      component: ShoppingListSimpleCard,
      options: {
        props: {
          shoppingList: { id: '1', dateCompleted: '2023-01-01' } as ListingShoppingListDTO,
        },
      },
    });

    const previousButton = wrapper.find('[data-testid="previous"]');
    expect(previousButton.exists()).toBe(true);
    await previousButton.trigger('click');
  });

  test('not shown when shopping list date completed is undefined', async () => {
    const wrapper = mountWithVuetify({
      component: ShoppingListSimpleCard,
      options: {
        props: {
          shoppingList: { id: '1', dateCompleted: undefined } as ListingShoppingListDTO,
        },
      },
    });

    const previousButton = wrapper.find('[data-testid="previous"]');
    expect(previousButton.exists()).toBe(false);
  });
});
