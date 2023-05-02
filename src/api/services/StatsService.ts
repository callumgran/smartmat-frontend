/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FoodProductHistoryDTO } from '../models/FoodProductHistoryDTO';
import type { UpdateFoodProductHistoryDTO } from '../models/UpdateFoodProductHistoryDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StatsService {
  /**
   * Get a single stat entry for a food product.
   * Returns a single stat entry for a food product. Requires admin access or household member access.
   * @returns FoodProductHistoryDTO OK
   * @throws ApiError
   */
  public static getFoodProductHistoryById({
    foodProductHistoryId,
  }: {
    foodProductHistoryId: string;
  }): CancelablePromise<FoodProductHistoryDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/{foodProductHistoryId}',
      path: {
        foodProductHistoryId: foodProductHistoryId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update a single stat entry for a food product.
   * Updates a single stat entry for a food product. Requires admin access or household member access.
   * @returns FoodProductHistoryDTO OK
   * @throws ApiError
   */
  public static updateFoodProductHistory({
    foodProductHistoryId,
    requestBody,
  }: {
    foodProductHistoryId: string;
    requestBody: UpdateFoodProductHistoryDTO;
  }): CancelablePromise<FoodProductHistoryDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/stats/{foodProductHistoryId}',
      path: {
        foodProductHistoryId: foodProductHistoryId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Delete a single stat entry for a food product.
   * Deletes a single stat entry for a food product. Requires admin access or household member access.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteFoodProductHistory({
    foodProductHistoryId,
  }: {
    foodProductHistoryId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/stats/{foodProductHistoryId}',
      path: {
        foodProductHistoryId: foodProductHistoryId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the history of all food products for a household.
   * Returns the history of all food products for a household of all time. If the user is not an admin, the householdId must be the id of the household the user is a member of.
   * @returns FoodProductHistoryDTO OK
   * @throws ApiError
   */
  public static getFoodProductHistoryForHousehold({
    householdId,
  }: {
    householdId: string;
  }): CancelablePromise<Array<FoodProductHistoryDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/household/{householdId}',
      path: {
        householdId: householdId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the total waste for a household.
   * Returns the total waste for a household of all time. If the user is not an admin, the householdId must be the id of the household the user is a member of.
   * @returns number OK
   * @throws ApiError
   */
  public static getTotalWasteForHousehold({
    householdId,
  }: {
    householdId: string;
  }): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/household/{householdId}/total',
      path: {
        householdId: householdId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the total waste for a household.
   * Returns the total waste for a household for a year. If the user is not an admin, the householdId must be the id of the household the user is a member of.
   * @returns number OK
   * @throws ApiError
   */
  public static getTotalWasteForHouseholdAndYear({
    householdId,
    year,
  }: {
    householdId: string;
    year: number;
  }): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/household/{householdId}/total/{year}',
      path: {
        householdId: householdId,
        year: year,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the total waste for a household.
   * Returns the total waste for a household for a month. If the user is not an admin, the householdId must be the id of the household the user is a member of.
   * @returns number OK
   * @throws ApiError
   */
  public static getTotalWasteForHouseholdAndYearAndMonth({
    householdId,
    year,
    month,
  }: {
    householdId: string;
    year: number;
    month: number;
  }): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/household/{householdId}/total/{year}/{month}',
      path: {
        householdId: householdId,
        year: year,
        month: month,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the history of a food product.
   * Returns the history of a food product for all households of all time. Requires admin access.
   * @returns FoodProductHistoryDTO OK
   * @throws ApiError
   */
  public static getFoodProductHistoryForProduct({
    foodProductId,
  }: {
    foodProductId: number;
  }): CancelablePromise<Array<FoodProductHistoryDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/foodproduct/{foodProductId}',
      path: {
        foodProductId: foodProductId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the history of a food product.
   * Returns the history of a food product for a household of all time. If the user is not an admin, the householdId must be the id of the household the user is a member of.
   * @returns FoodProductHistoryDTO OK
   * @throws ApiError
   */
  public static getFoodProductHistoryForProductAndHousehold({
    foodProductId,
    householdId,
  }: {
    foodProductId: number;
    householdId: string;
  }): CancelablePromise<Array<FoodProductHistoryDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/stats/foodproduct/{foodProductId}/household/{householdId}',
      path: {
        foodProductId: foodProductId,
        householdId: householdId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
