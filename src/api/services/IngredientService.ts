/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IngredientDTO } from '../models/IngredientDTO';
import type { SearchRequest } from '../models/SearchRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IngredientService {
  /**
   * Search for ingredients
   * Search for ingredients by a search request which contains sorting and filtering
   * @returns IngredientDTO OK
   * @throws ApiError
   */
  public static searchIngredients({
    requestBody,
  }: {
    requestBody: SearchRequest;
  }): CancelablePromise<Array<IngredientDTO>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/public/ingredients/search',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
