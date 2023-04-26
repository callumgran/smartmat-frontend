/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCustomFoodItemDTO } from '../models/CreateCustomFoodItemDTO';
import type { CustomFoodItemDTO } from '../models/CustomFoodItemDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CustomfooditemService {
  /**
   * Check an item in a shopping list
   * Checks or unchecks an item in a shopping list. Requires authentication and be privileged member of the household.
   * @returns CustomFoodItemDTO OK
   * @throws ApiError
   */
  public static checkOrUncheckItemOnShoppingList1({
    id,
  }: {
    id: string;
  }): CancelablePromise<CustomFoodItemDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/customfooditems/check-item/{id}',
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
   * @returns CustomFoodItemDTO OK
   * @throws ApiError
   */
  public static addItemToShoppingList1({
    requestBody,
  }: {
    requestBody: CreateCustomFoodItemDTO;
  }): CancelablePromise<CustomFoodItemDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/customfooditems',
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
  public static deleteItemFromShoppingList1({
    householdId,
    id,
  }: {
    householdId: string;
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/customfooditems/household/{householdId}/item/{id}',
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
