/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BasketItemDTO } from './BasketItemDTO';
import type { CustomFoodItemDTO } from './CustomFoodItemDTO';

export type BasketDTO = {
  id: string;
  shoppingListId: string;
  basketItems?: Array<BasketItemDTO>;
  customFoodItems?: Array<CustomFoodItemDTO>;
};
