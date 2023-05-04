/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UnitDTO } from './UnitDTO';

export type BareFoodProductDTO = {
  id: number;
  name: string;
  amount: number;
  looseWeight: boolean;
  ingredientId?: number;
  image: string;
  unit?: UnitDTO;
  notIngredient?: boolean;
  ean?: string;
};
