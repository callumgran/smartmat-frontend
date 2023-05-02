/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FoodProductDTO } from './FoodProductDTO';

export type FoodProductHistoryDTO = {
  foodProduct: FoodProductDTO;
  householdId: string;
  amount: number;
  thrownAmountInPercentage: number;
  date: string;
};
