/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CreateSanityConditionDto } from '../models/CreateSanityConditionDto';
import type { UpdateSanityConditionDto } from '../models/UpdateSanityConditionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SanityService {
    /**
     * Get all sanity conditions for a character
     * @param characterId Character ID
     * @returns any
     * @throws ApiError
     */
    public static sanityControllerFindByCharacter(
        characterId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sanity',
            query: {
                'characterId': characterId,
            },
        });
    }
    /**
     * Create a new sanity condition
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static sanityControllerCreate(
        requestBody: CreateSanityConditionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sanity',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update a sanity condition
     * @param id Sanity condition ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static sanityControllerUpdate(
        id: string,
        requestBody: UpdateSanityConditionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/sanity/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a sanity condition
     * @param id Sanity condition ID
     * @returns any
     * @throws ApiError
     */
    public static sanityControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/sanity/{id}',
            path: {
                'id': id,
            },
        });
    }
}
