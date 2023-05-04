/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecipeCreateDTO } from '../models/RecipeCreateDTO';
import type { RecipeDTO } from '../models/RecipeDTO';
import type { RecipeShoppingListItemDTO } from '../models/RecipeShoppingListItemDTO';
import type { RecipeUseDTO } from '../models/RecipeUseDTO';
import type { SearchRequest } from '../models/SearchRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RecipeService {
  /**
   * Get recipe
   * Get recipes by id.
   * @returns RecipeDTO OK
   * @throws ApiError
   */
  public static getRecipeById({ id }: { id: string }): CancelablePromise<RecipeDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/recipes/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Update a recipe
   * Update a recipe with the given id. The id in the path must match the id in the request body.
   * @returns RecipeDTO OK
   * @throws ApiError
   */
  public static updateRecipe({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: RecipeCreateDTO;
  }): CancelablePromise<RecipeDTO> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/recipes/{id}',
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
   * Delete a recipe
   * Delete a recipe with the given id.
   * @returns any OK
   * @throws ApiError
   */
  public static deleteRecipe({ id }: { id: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/recipes/{id}',
      path: {
        id: id,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Use a recipe
   * Use a recipe with the given id. The id in the path must match the id in the request body. Requires valid JWT token in header.
   * @returns any OK
   * @throws ApiError
   */
  public static useRecipe({
    id,
    requestBody,
  }: {
    id: string;
    requestBody: RecipeUseDTO;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/private/recipes/{id}/use',
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
   * Get all recipes
   * Get all recipes.
   * @returns RecipeDTO OK
   * @throws ApiError
   */
  public static getAllRecipes(): CancelablePromise<Array<RecipeDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/recipes',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Create a recipe
   * Create a recipe. Requires valid JWT token in header.
   * @returns RecipeDTO OK
   * @throws ApiError
   */
  public static createRecipe({
    requestBody,
  }: {
    requestBody: RecipeCreateDTO;
  }): CancelablePromise<RecipeDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/recipes',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Search recipes
   * Search recipes by name, ingredients and tags, and return a collection of recipes. Returns an empty collection if no recipes are found. Requires valid JWT token in header.
   * @returns RecipeDTO OK
   * @throws ApiError
   */
  public static searchRecipes({
    requestBody,
  }: {
    requestBody: SearchRequest;
  }): CancelablePromise<Array<RecipeDTO>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/recipes/search',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Gets the shopping list items for a household from a recipe
   * Gets the shopping list items for a household from a recipe. Requires authentication.
   * @returns RecipeShoppingListItemDTO OK
   * @throws ApiError
   */
  public static getShoppingListItems({
    id,
    householdId,
    portions,
  }: {
    id: string;
    householdId: string;
    portions: number;
  }): CancelablePromise<Array<RecipeShoppingListItemDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/recipes/{id}/items/{householdId}/{portions}',
      path: {
        id: id,
        householdId: householdId,
        portions: portions,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Search for recipes
   * Search for recipes by name.
   * @returns RecipeDTO OK
   * @throws ApiError
   */
  public static findRecipesByName({ name }: { name: string }): CancelablePromise<Array<RecipeDTO>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/recipes/search/{name}',
      path: {
        name: name,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
