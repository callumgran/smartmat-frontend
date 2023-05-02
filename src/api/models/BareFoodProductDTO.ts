/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BareFoodProductDTO = {
  id: number;
  name: string;
  amount: number;
  looseWeight: boolean;
  ingredientId?: number;
  image: string;
  notIngredient?: boolean;
  ean?: string;
};
