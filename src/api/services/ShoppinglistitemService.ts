/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateShoppingListItemDTO } from '../models/CreateShoppingListItemDTO';
import type { ShoppingListItemDTO } from '../models/ShoppingListItemDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ShoppinglistitemService {
  /**
   * Check an item in a shopping list
   * Checks or unchecks an item in a shopping list. Requires authentication and be privileged member of the household.
   * @returns ShoppingListItemDTO OK
   * @throws ApiError
   */
  public static checkOrUncheckItemOnShoppingList({
    id,
  }: {
    id: string;
  }): CancelablePromise<ShoppingListItemDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/shoppinglistitems/check-item/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Add an item to a shopping list
   * Add an item to a shopping list. Requires authentication and be owner of the household. First checks if an ingredient with the item name exists. If it does, it adds a shopping list item. Otherwise, it adds a custom food item.
   * @returns ShoppingListItemDTO OK
   * @throws ApiError
   */
  public static addItemToShoppingList({
    requestBody,
  }: {
    requestBody: CreateShoppingListItemDTO;
  }): CancelablePromise<ShoppingListItemDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/shoppinglistitems',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Delete an item from a shopping list
   * Delete an item from a shopping list. Requires authentication and be privileged member of the household or admin. First checks if a shopping list item exists. If it is, it deletes the shopping list item. Otherwise, it deletes the custom food item if possible.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteItemFromShoppingList({
    householdId,
    id,
  }: {
    householdId: string;
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/shoppinglistitems/household/{householdId}/item/{id}',
      path: {
        householdId: householdId,
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
