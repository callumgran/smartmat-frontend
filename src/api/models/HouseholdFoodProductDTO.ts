/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FoodProductDTO } from './FoodProductDTO';

export type HouseholdFoodProductDTO = {
  id?: string;
  foodProduct?: FoodProductDTO;
  householdId: string;
  expirationDate: string;
  amountLeft?: number;
};
