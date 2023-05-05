import { describe, test, expect } from 'vitest';
import mountWithVuetify from '@/testUtils';
import ChooseIngredientModal from '@/components/ShoppingList/ChooseIngredientModal.vue';
import { ShoppingListItemDTO } from '@/api';

describe('Choose ingredient', () => {
  test('checks if buttons are working as intended', async () => {
    const wrapper = mountWithVuetify({
      component: ChooseIngredientModal,
      options: {
        props: {
          ingredients: [{
            id: '1',
            amount: 1,
            checked: false,
            shoppingList: '1',
            ingredient: {
              id: 1,
              name: '',
              unit: {
                name: '',
                abbreviation: '',
                toNormalFormConversionFactor: 1,
              },
            },
          }] as ShoppingListItemDTO[],
        },
      },
    });

    const ingredientButton = wrapper.find('[data-testid="ingredient-button"]');
    expect(ingredientButton.exists()).toBe(true);
    await ingredientButton.trigger('click');

    const noIngredientButton = wrapper.find('[data-testid="no-ingredient-button"]');
    expect(noIngredientButton.exists()).toBe(true);
    await noIngredientButton.trigger('click');
  });
});
