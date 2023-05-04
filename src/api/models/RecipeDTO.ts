/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RecipeIngredientDTO } from './RecipeIngredientDTO';

export type RecipeDTO = {
  id: string;
  name: string;
  description: string;
  ingredients: Array<RecipeIngredientDTO>;
  instructions: string;
  estimatedMinutes: number;
  recipeDifficulty: RecipeDTO.recipeDifficulty;
  image?: string;
};

export namespace RecipeDTO {
  export enum recipeDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    ADVANCED = 'ADVANCED',
  }
}
