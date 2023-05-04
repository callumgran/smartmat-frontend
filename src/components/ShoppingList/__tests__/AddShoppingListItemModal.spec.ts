import { describe, test, expect, beforeAll } from 'vitest';
import mountWithVuetify from '@/testUtils';
import AddShoppingListItemModal from '@/components/ShoppingList/AddShoppingListItemModal.vue';

describe('Add items to shopping list', () => {
  test('button works as intended', async () => {
    const wrapper = mountWithVuetify({
      component: AddShoppingListItemModal,
    });

    const button1 = wrapper.find('[data-testid="suggestion"]');
    expect(button1.exists()).toBe(true);
    await button1.trigger('click');

    const button2 = wrapper.find('[data-testid="close"]');
    expect(button2.exists()).toBe(true);
    await button2.trigger('click');

    const button3 = wrapper.find('[data-testid="add"]');
    expect(button3.exists()).toBe(true);
    await button3.trigger('click');
  });

  test('Headline works as intended', async () => {
    const wrapper = mountWithVuetify({
      component: AddShoppingListItemModal,
    });

    const headline = wrapper.find('[data-testid="headline-test"]');
    expect(headline.exists()).toBe(true);
  });
});
