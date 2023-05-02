import { describe, test, expect, beforeEach, vi, SpyInstance, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import { RecipeDTO } from '@/api';
import RecipeCard from '@/components/Recipe/RecipeCard.vue';

describe('Test recipe card', () => {
  test('Recipe title is shown on recipe list card', () => {
    const wrapper = mountWithVuetify({
      component: RecipeCard,
      options: {
        props: {
          recipe: {
            id: '1',
            name: 'TestRecipe',
            description: 'TestDescription',
            instructions: 'TestInstructions',
            estimatedMinutes: 1,
            servings: 1,
            ingredients: [],
            recipeDifficulty: 'EASY',
          } as RecipeDTO,
        },
      },
    });
    const recipeTitle = wrapper.find('[data-testid="recipe-card-title"]');
    expect(recipeTitle.exists()).toBe(true);
    expect(recipeTitle.text()).toBe('TestRecipe');
  });
});
