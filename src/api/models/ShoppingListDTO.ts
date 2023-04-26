/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomFoodItemDTO } from './CustomFoodItemDTO';
import type { ShoppingListItemDTO } from './ShoppingListItemDTO';

export type ShoppingListDTO = {
  id: string;
  dateCompleted?: string;
  household: string;
  shoppingListItems: Array<ShoppingListItemDTO>;
  customFoodItems: Array<CustomFoodItemDTO>;
};
