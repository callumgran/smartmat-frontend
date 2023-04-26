/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomFoodItemDTO } from './CustomFoodItemDTO';
import type { HouseholdFoodProductDTO } from './HouseholdFoodProductDTO';
import type { HouseholdMemberDTO } from './HouseholdMemberDTO';
import type { ListingShoppingListDTO } from './ListingShoppingListDTO';

export type HouseholdDTO = {
  id: string;
  name: string;
  members?: Array<HouseholdMemberDTO>;
  foodProducts?: Array<HouseholdFoodProductDTO>;
  shoppingLists?: Array<ListingShoppingListDTO>;
  customFoodItems?: Array<CustomFoodItemDTO>;
};
