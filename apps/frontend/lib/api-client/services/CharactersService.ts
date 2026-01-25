/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCharacterDto } from '../models/CreateCharacterDto';
import type { UpdateCharacterDto } from '../models/UpdateCharacterDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CharactersService {
    /**
     * Get all characters
     * @param userId Filter by user ID
     * @returns any List of characters retrieved
     * @throws ApiError
     */
    public static charactersControllerFindAll(
        userId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/characters',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * Create a new character
     * @param requestBody
     * @returns any Character created successfully
     * @throws ApiError
     */
    public static charactersControllerCreate(
        requestBody: CreateCharacterDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/characters',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid character data`,
            },
        });
    }
    /**
     * Get character by ID
     * @param id Character ID
     * @returns any Character retrieved
     * @throws ApiError
     */
    public static charactersControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/characters/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Character not found`,
            },
        });
    }
    /**
     * Update character
     * @param id Character ID
     * @param requestBody
     * @returns any Character updated successfully
     * @throws ApiError
     */
    public static charactersControllerUpdate(
        id: string,
        requestBody: UpdateCharacterDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/characters/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Character not found`,
            },
        });
    }
    /**
     * Delete character
     * @param id Character ID
     * @returns any Character deleted successfully
     * @throws ApiError
     */
    public static charactersControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/characters/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Character not found`,
            },
        });
    }
}
