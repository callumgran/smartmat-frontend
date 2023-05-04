import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import mountWithVuetify from '@/testUtils';
import { VueWrapper } from '@vue/test-utils';
import RecipeList from '@/components/Recipe/RecipeList.vue';
import { BareIngredientDTO, FoodProductDTO, RecipeDTO, RecipeIngredientDTO } from '@/api';
import recipeDifficulty = RecipeDTO.recipeDifficulty;
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { K as Server } from 'msw/lib/glossary-de6278a9';

describe('Test RecipeList', () => {
  const ingredients: RecipeIngredientDTO[] = [
    {
      ingredient: {
        id: 1,
        name: 'Melk',
      } as BareIngredientDTO,
      amount: 1,
    },
    {
      ingredient: {
        id: 2,
        name: 'Egg',
      } as BareIngredientDTO,
      amount: 2,
    },
  ];

  const recipes: RecipeDTO[] = [
    {
      id: '1',
      name: 'Eggerøre',
      description: 'Verdens beste eggerøre',
      ingredients: ingredients,
      instructions: 'Visp egg og melk og hakk på panne',
      estimatedMinutes: 30,
      recipeDifficulty: recipeDifficulty.MEDIUM,
    },
    {
      id: '2',
      name: 'Omelett',
      description: 'Verdens beste omelett',
      ingredients: ingredients,
      instructions: 'Visp egg og melk, la steke i fred på panne',
      estimatedMinutes: 45,
      recipeDifficulty: recipeDifficulty.EASY,
    },
  ];

  let wrapper: VueWrapper<any>;
  let server: Server;

  beforeAll(() => {
    const restTemplates = [
      rest.post('http://localhost:8080/api/v1/private/recipes/search', (req, res, ctx) => {
        return res(
          ctx.json([
            {
              name: 'tine melk',
            },
          ] as RecipeDTO[]),
        );
      }),
    ];
    server = setupServer(...restTemplates);
    server.listen();
  });

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: RecipeList,
      options: {
        props: {
          recipes,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  afterAll(() => {
    server.close();
  });

  test('Component renders search input', () => {
    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect(searchInput.exists()).toBe(true);
  });

  test('Component renders sort by amount button', () => {
    const sortByAmountButton = wrapper.find('[data-testid="sort-by-amount"]');
    expect(sortByAmountButton.exists()).toBe(true);
  });

  test('Component renders correct number of recipe cards', () => {
    const recipeCards = wrapper.findAllComponents({ name: 'RecipeCard' });
    expect(recipeCards.length).toBe(recipes.length);
  });

  test('Component shuffles recipes based on "Bli inspirert"', async () => {
    const randomFilter = wrapper.find('[value="random"]');
    await randomFilter.trigger('click');
    const initialSuggestionOrder = recipes.map((recipe) => recipe.id);
    let newSuggestionOrder = wrapper
      .findAllComponents({ name: 'RecipeCard' })
      .map((recipeCard) => recipeCard.props().recipe.id);

    let attempts = 0;
    while (newSuggestionOrder.toString() === initialSuggestionOrder.toString() && attempts < 20) {
      await randomFilter.trigger('click');
      newSuggestionOrder = wrapper
        .findAllComponents({ name: 'RecipeCard' })
        .map((recipeCard) => recipeCard.props().recipe.id);
      attempts += 1;
    }
    expect(newSuggestionOrder).not.toEqual(initialSuggestionOrder);
  });
});
