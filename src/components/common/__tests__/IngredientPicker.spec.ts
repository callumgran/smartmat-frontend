import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import IngredientPicker from '@/components/common/IngredientPicker.vue';
import { VueWrapper } from '@vue/test-utils';
import { IngredientDTO } from '@/api';

describe('Test IngredientPicker', () => {
  const ingredients: IngredientDTO[] = [
    {
      id: 1,
      name: 'Potato',
      foodProducts: [],
    },
    {
      id: 2,
      name: 'Carrot',
      foodProducts: [],
    },
  ];

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: IngredientPicker,
      options: {
        props: {
          startList: ingredients,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Component has the correct title', () => {
    const title = wrapper.find('[data-testid="choose-ingredient-title"]');
    expect(title.text()).toBe('Velg ingrediens');
  });

  test('Component has a button', () => {
    const button = wrapper.find('[data-testid="not-ingredient-button"]');
    expect(button.exists()).toBeTruthy();
  });
});
