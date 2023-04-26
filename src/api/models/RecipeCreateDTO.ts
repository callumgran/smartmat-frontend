/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateUpdateRecipeIngredientDTO } from './CreateUpdateRecipeIngredientDTO';

export type RecipeCreateDTO = {
  name: string;
  description: string;
  ingredients: Array<CreateUpdateRecipeIngredientDTO>;
  instructions: string;
  estimatedMinutes: number;
  recipeDifficulty: string;
};
