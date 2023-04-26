/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BareIngredientDTO } from './BareIngredientDTO';

export type FoodProductDTO = {
  id?: number;
  name: string;
  amount?: number;
  looseWeight?: boolean;
  ingredient?: BareIngredientDTO;
  ean?: string;
};
