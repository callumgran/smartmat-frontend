/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BareIngredientDTO } from './BareIngredientDTO';
import type { UnitDTO } from './UnitDTO';

export type RecipeIngredientDTO = {
  ingredient: BareIngredientDTO;
  amount: number;
  unit: UnitDTO;
};
