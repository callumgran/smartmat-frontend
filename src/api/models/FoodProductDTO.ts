/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BareIngredientDTO } from './BareIngredientDTO';
import type { UnitDTO } from './UnitDTO';

export type FoodProductDTO = {
  id: number;
  name: string;
  amount: number;
  looseWeight: boolean;
  image: string;
  ingredient?: BareIngredientDTO;
  unit?: UnitDTO;
  notIngredient?: boolean;
  firstTime?: boolean;
  ean?: string;
};
