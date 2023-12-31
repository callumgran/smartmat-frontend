/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IngredientFoodProductDTO } from './IngredientFoodProductDTO';
import type { UnitDTO } from './UnitDTO';

export type IngredientDTO = {
  id: number;
  name: string;
  unit?: UnitDTO;
  foodProducts: Array<IngredientFoodProductDTO>;
};
