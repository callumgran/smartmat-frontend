/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BareIngredientDTO } from './BareIngredientDTO';

export type ShoppingListItemDTO = {
  id: string;
  amount: number;
  checked: boolean;
  shoppingList: string;
  ingredient?: BareIngredientDTO;
};
