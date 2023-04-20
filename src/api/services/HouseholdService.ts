/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHouseholdDTO } from '../models/CreateHouseholdDTO';
import type { HouseholdDTO } from '../models/HouseholdDTO';
import type { UpdateHouseholdDTO } from '../models/UpdateHouseholdDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HouseholdService {
  /**
   * Get a household by id
   * Get a household by id, if the household does not exist, an error is thrown. Requires authentication.
   * @returns HouseholdDTO OK
   * @throws ApiError
   */
  public static getHousehold({ id }: { id: string }): CancelablePromise<HouseholdDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update a households name
   * Update a households name, if the household does not exist, an error is thrown. Requires authentication.
   * @returns HouseholdDTO OK
   * @throws ApiError
   */
  public static updateHouseholdName({
    requestBody,
  }: {
    requestBody: UpdateHouseholdDTO;
  }): CancelablePromise<HouseholdDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/households/{id}',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Delete a household
   * Delete a household, if the household does not exist, an error is thrown. Requires authentication.
   * @returns string OK
   * @throws ApiError
   */
  public static deleteHousehold({ id }: { id: string }): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/households/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Create a household
   * Create a household, if the user does not exist, an error is thrown. Requires authentication.
   * @returns HouseholdDTO OK
   * @throws ApiError
   */
  public static createHousehold({
    requestBody,
  }: {
    requestBody: CreateHouseholdDTO;
  }): CancelablePromise<HouseholdDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/households',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get all households for a user
   * Get all households for a user, if the user does not exist, an error is thrown. Requires authentication.
   * @returns HouseholdDTO OK
   * @throws ApiError
   */
  public static getHouseholdsForUser({
    username,
  }: {
    username: string;
  }): CancelablePromise<Array<HouseholdDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/user/{username}',
      path: {
        username: username,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
