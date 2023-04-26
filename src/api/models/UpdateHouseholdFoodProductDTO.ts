/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateHouseholdFoodProductDTO = {
  id?: string;
  foodProductId?: number;
  householdId: string;
  expirationDate: string;
  amountLeft?: number;
};
