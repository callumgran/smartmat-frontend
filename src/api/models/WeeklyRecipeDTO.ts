/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RecipeDTO } from './RecipeDTO';

export type WeeklyRecipeDTO = {
  recipe: RecipeDTO;
  dateToUse: string;
  used: boolean;
};
