/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BareIngredientDTO } from './BareIngredientDTO';

export type RecipeShoppingListItemDTO = {
  amount: number;
  checked: boolean;
  ingredient?: BareIngredientDTO;
};
