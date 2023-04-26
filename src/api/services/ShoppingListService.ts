/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateShoppingListDTO } from '../models/CreateShoppingListDTO';
import type { ShoppingListDTO } from '../models/ShoppingListDTO';
import type { UpdateShoppingListDTO } from '../models/UpdateShoppingListDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ShoppingListService {
  /**
   * Get a shopping list by id
   * Get a shopping list by id. Requires authentication and be part of the household.
   * @returns ShoppingListDTO OK
   * @throws ApiError
   */
  public static getShoppingList({ id }: { id: string }): CancelablePromise<ShoppingListDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/shoppinglists/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update a shopping list by id
   * Update a shopping list by id. Requires authentication and be owner of the household.
   * @returns ShoppingListDTO OK
   * @throws ApiError
   */
  public static updateShoppingList({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: UpdateShoppingListDTO;
  }): CancelablePromise<ShoppingListDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/shoppinglists/{id}',
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
   * Delete a shopping list by id
   * Delete a shopping list by id. Requires authentication and be owner of the household.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteShoppingList({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/shoppinglists/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Complete a shopping list by id
   * Complete a shopping list by id. Requires authentication and be owner of the household.
   * @returns ShoppingListDTO OK
   * @throws ApiError
   */
  public static completeShoppingList({ id }: { id: string }): CancelablePromise<ShoppingListDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/shoppinglists/{id}/complete',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Creates a new shopping list for the given household
   * Get a household by id and create a shopping list if an open one does not exist. Requires authentication and be owner of the household.
   * @returns ShoppingListDTO OK
   * @throws ApiError
   */
  public static createShoppingList({
    requestBody,
  }: {
    requestBody: CreateShoppingListDTO;
  }): CancelablePromise<ShoppingListDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/shoppinglists',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
