import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import WeeklyMenuCard from '@/components/Household/WeeklyMenu/WeeklyMenuCard.vue';
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

  const weeklyMenu = [] as WeeklyRecipeDTO[];
  weeklyMenu.push({
    recipe: recipe,
    dateToUse: '2021-05-10',
    used: false,
    portions: 4,
  });

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: WeeklyMenuCard,
      options: {
        props: {
          weeklyMenu,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component renders weekly menu card', () => {
    const id = wrapper.find('[data-testid="weekly-menu-card"]');
    expect(id.exists()).toBe(true);
  });
});
