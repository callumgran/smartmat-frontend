/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FoodProductDTO } from '../models/FoodProductDTO';
import type { SearchRequest } from '../models/SearchRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FoodproductService {
  /**
   * Get a food product by id
   * Get a food product by its id, requires authentication.
   * @returns FoodProductDTO OK
   * @throws ApiError
   */
  public static getFoodProductById({ id }: { id: number }): CancelablePromise<FoodProductDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/foodproducts/id/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update a food product
   * Update a food product, requires authentication.
   * @returns FoodProductDTO OK
   * @throws ApiError
   */
  public static updateFoodProduct({
    id,
    requestBody,
  }: {
    id: number;
    requestBody: FoodProductDTO;
  }): CancelablePromise<FoodProductDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/foodproducts/id/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Delete a food product
   * Delete a food product, requires authentication.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteFoodProduct({ id }: { id: number }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/foodproducts/id/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Create a food product
   * Create a food product, requires authentication.
   * @returns FoodProductDTO OK
   * @throws ApiError
   */
  public static createFoodProduct({
    requestBody,
  }: {
    requestBody: FoodProductDTO;
  }): CancelablePromise<FoodProductDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/foodproducts',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Search for food products
   * Search for food products, requires authentication.
   * @returns FoodProductDTO OK
   * @throws ApiError
   */
  public static searchFoodProducts({
    requestBody,
  }: {
    requestBody: SearchRequest;
  }): CancelablePromise<Array<FoodProductDTO>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/foodproducts/search',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get a food product by EAN
   * Get a food product by its EAN, requires authentication.
   * @returns FoodProductDTO OK
   * @throws ApiError
   */
  public static getFoodProductByEan({ ean }: { ean: string }): CancelablePromise<FoodProductDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/foodproducts/ean/{EAN}',
      path: {
        EAN: ean,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
