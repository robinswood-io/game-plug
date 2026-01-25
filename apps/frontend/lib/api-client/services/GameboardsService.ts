/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGameboardDto } from '../models/CreateGameboardDto';
import type { UpdateGameboardDto } from '../models/UpdateGameboardDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GameboardsService {
    /**
     * Get gameboard for a session
     * Retrieves the complete gameboard state including characters, chapters, and events
     * @param sessionId Game session ID
     * @returns any
     * @throws ApiError
     */
    public static gameboardControllerGetGameboard(
        sessionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/gameboards/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
        });
    }
    /**
     * Create a new gameboard
     * Initializes a gameboard for a game session
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static gameboardControllerCreate(
        requestBody: CreateGameboardDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/gameboards',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update gameboard state
     * Updates the gameboard configuration or state
     * @param id Gameboard ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static gameboardControllerUpdate(
        id: string,
        requestBody: UpdateGameboardDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/gameboards/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
