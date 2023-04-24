/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IngredientDTO } from '../models/IngredientDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IngredientControllerService {
  /**
   * @returns IngredientDTO OK
   * @throws ApiError
   */
  public static getIngredient({ id }: { id: number }): CancelablePromise<IngredientDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/public/ingredients/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
