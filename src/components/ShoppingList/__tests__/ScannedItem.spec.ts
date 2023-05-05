import { describe, test, expect } from 'vitest';
import mountWithVuetify from '@/testUtils';
import ScannedItem from '@/components/ShoppingList/ScannedItem.vue';
import { FoodProductDTO, ShoppingListItemDTO } from '@/api';

describe('food product rendering', () => {
  test('checks if food product is rendering', async () => {
    const wrapper = mountWithVuetify({
      component: ScannedItem,
      options: {
        props: {
          foodProduct: {
            id: 1,
            name: '',
            amount: 1,
            looseWeight: false,
            image: '',
            ingredient: {
              id: 1,
              name: '',
              unit: {
                name: '',
                abbreviation: '',
                toNormalFormConversionFactor: 1,
                unitType: 'SOLID',
              },
            },
            notIngredient: false,
            ean: '',
          } as FoodProductDTO,
        },
      },
    });

    const foodProductRend = wrapper.find('[data-testid="food-product"]');
    expect(foodProductRend.exists()).toBe(true);
  });
});
