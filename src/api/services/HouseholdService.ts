/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHouseholdDTO } from '../models/CreateHouseholdDTO';
import type { HouseholdDTO } from '../models/HouseholdDTO';
import type { HouseholdMemberDTO } from '../models/HouseholdMemberDTO';
import type { RecipeRecommendationDTO } from '../models/RecipeRecommendationDTO';
import type { ShoppingListDTO } from '../models/ShoppingListDTO';
import type { UpdateHouseholdDTO } from '../models/UpdateHouseholdDTO';
import type { WeeklyRecipeDTO } from '../models/WeeklyRecipeDTO';

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
   * Update the role of a user in a household
   * Update the role of a user in a household, if the user or household does not exist, an error is thrown. Requires authentication.
   * @returns HouseholdMemberDTO OK
   * @throws ApiError
   */
  public static updateUserInHousehold({
    id,
    username,
    requestBody,
  }: {
    id: string;
    username: string;
    requestBody: 'OWNER' | 'PRIVILEGED_MEMBER' | 'MEMBER';
  }): CancelablePromise<HouseholdMemberDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/households/{id}/user/{username}',
      path: {
        id: id,
        username: username,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Add a user to a household
   * Add a user to a household, if the user or household does not exist, an error is thrown. Requires authentication.
   * @returns HouseholdMemberDTO OK
   * @throws ApiError
   */
  public static addUserToHousehold({
    id,
    username,
  }: {
    id: string;
    username: string;
  }): CancelablePromise<HouseholdMemberDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/households/{id}/user/{username}',
      path: {
        id: id,
        username: username,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Remove a user from a household
   * Remove a user from a household, if the user or household does not exist, an error is thrown. Requires authentication.
   * @returns string OK
   * @throws ApiError
   */
  public static removeUserFromHousehold({
    id,
    username,
  }: {
    id: string;
    username: string;
  }): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/households/{id}/user/{username}',
      path: {
        id: id,
        username: username,
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
   * Add a weekly recipe to a household
   * Add a weekly recipe to a household. Requires authentication.
   * @returns any OK
   * @throws ApiError
   */
  public static addWeeklyRecipe({
    id,
    recipeId,
    requestBody,
  }: {
    id: string;
    recipeId: string;
    requestBody: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/households/{id}/recipes/{recipeId}',
      path: {
        id: id,
        recipeId: recipeId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get recommended recipes for a household
   * Get recommended recipes for a household. Recipes are recommended based on the household's ingredients. Requires authentication.
   * @returns RecipeRecommendationDTO OK
   * @throws ApiError
   */
  public static getRecommendedRecipes({
    id,
  }: {
    id: string;
  }): CancelablePromise<Array<RecipeRecommendationDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/{id}/recipes',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Gets the weekly recipes for a household from a specific monday
   * Gets the weekly recipes for a household from a specific monday. Requires authentication.
   * @returns WeeklyRecipeDTO OK
   * @throws ApiError
   */
  public static getWeeklyRecipes({
    id,
    monday,
  }: {
    id: string;
    monday: string;
  }): CancelablePromise<Array<WeeklyRecipeDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/{id}/recipes/{monday}',
      path: {
        id: id,
        monday: monday,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Get the current shopping list by a household
   * Get a household by id and find its current shopping list. Requires authentication.
   * @returns ShoppingListDTO OK
   * @throws ApiError
   */
  public static getCurrentShoppingList({ id }: { id: string }): CancelablePromise<ShoppingListDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/households/{id}/current',
      path: {
        id: id,
      },
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

  /**
   * Delete temporary used ingredients for a household on a specific date
   * Delete temporary used ingredients for a household on a specific date. Requires authentication.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteWeeklyRecipe({
    id,
    date,
  }: {
    id: string;
    date: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/households/{id}/recipes/{date}',
      path: {
        id: id,
        date: date,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
