/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FoodProductDTO } from './FoodProductDTO';

export type BasketItemDTO = {
  id: string;
  foodProduct: FoodProductDTO;
  amount: number;
  basketId: string;
};
