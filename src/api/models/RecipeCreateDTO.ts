/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RecipeIngredientDTO } from './RecipeIngredientDTO';

export type RecipeCreateDTO = {
  name: string;
  description: string;
  ingredients: Array<RecipeIngredientDTO>;
  instructions: string;
  estimatedMinutes: number;
  recipeDifficulty: string;
};
