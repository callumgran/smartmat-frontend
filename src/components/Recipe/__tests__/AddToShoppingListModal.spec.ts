import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import mountWithVuetify from '@/testUtils';
import AddToShoppingListModalVue from '@/components/Recipe/AddToShoppingListModal.vue';
import { HouseholdService, RecipeIngredientDTO, ShoppinglistitemService } from '@/api';
import { VCard } from 'vuetify/components';
import { VueWrapper } from '@vue/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { K as Server } from 'msw/lib/glossary-de6278a9';

describe('Test add to shopping list modal', () => {
  let wrapper: VueWrapper<any>;
  const ingredientOne = 'IngredientOne';
  const ingredientTwo = 'IngredientTwo';
  let server: Server;

  beforeAll(() => {
    const restTemplates = [
      rest.get('http://localhost:8080/api/v1/private/households/1/current', (req, res, ctx) => {
        return res(
          ctx.json({
            id: 1,
            dateCompleted: null,
            household: '1',
            shoppingListItems: [],
            customFoodItems: [],
          }),
        );
      }),
      rest.post('http://localhost:8080/api/v1/private/shoppinglistitems', (req, res, ctx) => {
        return res(ctx.status(201));
      }),
    ];

    server = setupServer(...restTemplates);
    server.listen();
  });

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: AddToShoppingListModalVue,
      options: {
        props: {
          recipeIngredientsToList: [
            {
              ingredient: {
                id: 1,
                name: ingredientOne,
                unit: {
                  name: 'TestUnit',
                  abbreviation: 'TU',
                },
              },
            },
            {
              ingredient: {
                id: 2,
                name: ingredientTwo,
                unit: {
                  name: 'TestUnit',
                  abbreviation: 'TU',
                },
              },
            },
          ] as RecipeIngredientDTO[],
          household: '1',
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test('Test find button', async () => {
    wrapper = mountWithVuetify({
      component: AddToShoppingListModalVue,
      options: {
        props: {
          recipeIngredientsToList: [],
          household: '1',
        },
      },
    });
    const basketButton = wrapper.find('[data-testid="add-to-shopping-list-modal-button"]');
    expect(basketButton.exists()).toBe(true);
  });

  test('Button clicked shows modal', async () => {
    wrapper = mountWithVuetify({
      component: AddToShoppingListModalVue,
      options: {
        props: {
          recipeIngredientsToList: [] as RecipeIngredientDTO[],
          household: '1',
        },
      },
    });

    const modalDialogFirstTime = wrapper.find('[data-testid="modal-dialog"]');
    expect(modalDialogFirstTime.exists()).toBe(false);
    const button = wrapper.find('[data-testid="add-to-shopping-list-modal-button"]');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    const modalSecondTime = wrapper.getComponent(VCard);
    const modalDialogAfterClick = modalSecondTime.find('[data-testid="modal-dialog"]');
    expect(modalDialogAfterClick.exists()).toBe(true);
  });

  /*   test('Modal shows checkboxes for each ingredient', async () => {
    const button = wrapper.find('[data-testid="add-to-shopping-list-modal-button"]');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    const modalCard = wrapper.getComponent(VCard);
    const checkboxes = modalCard.findAll('[data-testid="ingredient-checkbox"]');
    expect(checkboxes.length).toBe(2);
    expect(checkboxes[0].text().indexOf(ingredientOne)).not.toBe(-1);
    expect(checkboxes[1].text().indexOf(ingredientTwo)).not.toBe(-1);
  });

  test('Adding to shopping list calls api and closes modal', async () => {
    const currentListSpy = vi.spyOn(HouseholdService, 'getCurrentShoppingList');
    const addItemSpy = vi.spyOn(ShoppinglistitemService, 'addItemToShoppingList');

    const button = wrapper.find('[data-testid="add-to-shopping-list-modal-button"]');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    const modalCard = wrapper.getComponent(VCard);
    const addToShoppingListButton = modalCard.find('[data-testid="add-to-shopping-list-button"]');
    expect(addToShoppingListButton.exists()).toBe(true);
    await addToShoppingListButton.trigger('click');
    await HouseholdService.getCurrentShoppingList({ id: '1' });
    await ShoppinglistitemService.addItemToShoppingList({
      requestBody: { ingredientId: 1, amount: 1, name: 'List item', shoppingListId: '1' },
    });
    expect(currentListSpy).toHaveBeenCalledTimes(2);
    expect(addItemSpy).toHaveBeenCalledTimes(2);
  }); */
});
