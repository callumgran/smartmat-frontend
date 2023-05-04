/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BasketDTO } from '../models/BasketDTO';
import type { CreateBasketDTO } from '../models/CreateBasketDTO';
import type { CreateBasketItemDTO } from '../models/CreateBasketItemDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BasketService {
  /**
   * Adds an item to the shopping list basket.
   * Adds an item to the shopping list basket, can only be done by a privileged user or an admin.
   * @returns any OK
   * @throws ApiError
   */
  public static addItemToBasket({
    basketId,
    requestBody,
  }: {
    basketId: string;
    requestBody: CreateBasketItemDTO;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/basket/{basketId}/add-item',
      path: {
        basketId: basketId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Adds a custom item to the shopping list basket.
   * Adds a custom item to the shopping list basket, can only be done by a privileged user or an admin.
   * @returns any OK
   * @throws ApiError
   */
  public static addItemToBasket1({
    basketId,
    requestBody,
  }: {
    basketId: string;
    requestBody: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/basket/{basketId}/add-custom',
      path: {
        basketId: basketId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Creates a new shopping list basket.
   * Creates a new shopping list basket, can only be done by a privileged user or an admin.
   * @returns BasketDTO OK
   * @throws ApiError
   */
  public static createBasket({
    requestBody,
  }: {
    requestBody: CreateBasketDTO;
  }): CancelablePromise<BasketDTO> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/private/basket/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Gets a shopping list basket.
   * Gets a shopping list basket, can only be done by a privileged user or an admin.
   * @returns BasketDTO OK
   * @throws ApiError
   */
  public static getBasket({ basketId }: { basketId: string }): CancelablePromise<BasketDTO> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/private/basket/{basketId}',
      path: {
        basketId: basketId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Removes an item from the shopping list basket.
   * Removes an item from the shopping list basket, can only be done by a privileged user or an admin.
   * @returns any OK
   * @throws ApiError
   */
  public static removeItemFromBasket({
    basketId,
    basketItemId,
  }: {
    basketId: string;
    basketItemId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/basket/{basketId}/item/{basketItemId}',
      path: {
        basketId: basketId,
        basketItemId: basketItemId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Removes a custom item from the shopping list basket.
   * Removes a custom item from the shopping list basket, can only be done by a privileged user or an admin.
   * @returns any OK
   * @throws ApiError
   */
  public static removeCustomItemFromBasket({
    basketId,
    basketItemId,
  }: {
    basketId: string;
    basketItemId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/private/basket/{basketId}/custom-item/{basketItemId}',
      path: {
        basketId: basketId,
        basketItemId: basketItemId,
      },
      errors: {
        500: `Internal Server Error`,
      },
    });
  }
}
