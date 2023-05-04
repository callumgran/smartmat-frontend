import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import WeeklyRecipeCard from '@/components/Recipe/WeeklyRecipeCard.vue';
import { VueWrapper } from '@vue/test-utils';
import { WeeklyRecipeDTO, RecipeDTO } from '@/api';

describe('Test weekly recipe card', () => {
  const recipe = {
    id: 'recipe1',
    name: 'Recipe 1',
    description: 'Recipe 1 description',
    ingredients: [],
    instructions: '1',
    recipeDifficulty: RecipeDTO.recipeDifficulty.EASY,
    estimatedMinutes: 10,
  } as RecipeDTO;

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: WeeklyRecipeCard,
      options: {
        props: {
          recipe,
          servings: 4,
          used: true,
          date: new Date(),
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component renders recipe card', () => {
    const name = wrapper.find('[data-testid="recipe-name"]');
    expect(name.text()).toBe('Recipe 1');
  });

  test('Component renders recipe card with correct servings', () => {
    const servings = wrapper.find('[data-testid="servings"]');
    expect(servings.text()).toBe('4 porsjoner');
  });

  test('Component only renders delete button if recipe is not used and date is not expired', () => {
    const deleteButton = wrapper.find('[data-testid="delete-button"]');
    expect(deleteButton.exists()).toBe(false);
  });
});
