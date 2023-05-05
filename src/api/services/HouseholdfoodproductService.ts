/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHouseholdFoodProductDTO } from '../models/CreateHouseholdFoodProductDTO';
import type { HouseholdFoodProductDTO } from '../models/HouseholdFoodProductDTO';
import type { SearchRequest } from '../models/SearchRequest';
import type { UpdateHouseholdFoodProductDTO } from '../models/UpdateHouseholdFoodProductDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HouseholdfoodproductService {
  /**
   * Update a household food product
   * Delete a household food product, requires authentication and admin or household privilege.
   * @returns HouseholdFoodProductDTO OK
   * @throws ApiError
   */
  public static updateHouseholdFoodProduct({
    householdId,
    id,
    requestBody,
  }: {
    householdId: string;
    id: string;
    requestBody: UpdateHouseholdFoodProductDTO;
  }): CancelablePromise<HouseholdFoodProductDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/households/{householdId}/foodproducts/id/{id}',
      path: {
        householdId: householdId,
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
   * Delete a household food product
   * Delete a household food product, requires authentication and admin or household privilege.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteHouseholdFoodProduct({
    householdId,
    id,
  }: {
    householdId: string;
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/households/{householdId}/foodproducts/id/{id}',
      path: {
        householdId: householdId,
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Use a household food product
   * Use a household food product, requires authentication and admin or household privilege.
   * @returns HouseholdFoodProductDTO OK
   * @throws ApiError
   */
  public static useHouseholdFoodProduct({
    householdId,
    id,
    requestBody,
  }: {
    householdId: string;
    id: string;
    requestBody: number;
  }): CancelablePromise<HouseholdFoodProductDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/households/{householdId}/foodproducts/id/{id}/use',
      path: {
        householdId: householdId,
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
   * Create a household food product
   * Delete a household food product, requires authentication and admin or household privilege.
   * @returns HouseholdFoodProductDTO OK
   * @throws ApiError
   */
  public static createHouseholdFoodProduct({
    householdId,
    requestBody,
  }: {
    householdId: string;
    requestBody: CreateHouseholdFoodProductDTO;
  }): CancelablePromise<HouseholdFoodProductDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/households/{householdId}/foodproducts',
      path: {
        householdId: householdId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Search for a household food product
   * Search for a household food product by its name and the household id, requires authentication and household membership.
   * @returns HouseholdFoodProductDTO OK
   * @throws ApiError
   */
  public static searchForHouseholdFoodProduct({
    householdId,
    requestBody,
  }: {
    householdId: string;
    requestBody: SearchRequest;
  }): CancelablePromise<Array<HouseholdFoodProductDTO>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/households/{householdId}/foodproducts/search',
      path: {
        householdId: householdId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get a household food product by id
   * Get a household food product by its id and the household id, requires authentication and household membership.
   * @returns HouseholdFoodProductDTO OK
   * @throws ApiError
   */
  public static getHouseholdFoodProductById({
    householdId,
    id,
  }: {
    householdId: string;
    id: string;
  }): CancelablePromise<HouseholdFoodProductDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/{householdId}/foodproducts/{id}',
      path: {
        householdId: householdId,
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get a household food product by ean
   * Get a household food product by its ean and the household id, requires authentication.
   * @returns HouseholdFoodProductDTO OK
   * @throws ApiError
   */
  public static getHouseholdFoodProductByEan({
    householdId,
    ean,
  }: {
    householdId: string;
    ean: string;
  }): CancelablePromise<Array<HouseholdFoodProductDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/{householdId}/foodproducts/ean/{ean}',
      path: {
        householdId: householdId,
        ean: ean,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Use a household food product
   * Use a household food product, requires authentication and admin or household privilege.
   * @returns any OK
   * @throws ApiError
   */
  public static throwHouseholdFoodProduct({
    householdId,
    id,
  }: {
    householdId: string;
    id: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/households/{householdId}/foodproducts/id/{id}/throw',
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
