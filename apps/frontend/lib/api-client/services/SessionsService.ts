/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSessionDto } from '../models/CreateSessionDto';
import type { UpdateSessionDto } from '../models/UpdateSessionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionsService {
    /**
     * Get all sessions
     * @param gmId
     * @returns any List of sessions
     * @throws ApiError
     */
    public static sessionsControllerFindAll(
        gmId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sessions',
            query: {
                'gmId': gmId,
            },
        });
    }
    /**
     * Create new session
     * @param requestBody
     * @returns any Session created
     * @throws ApiError
     */
    public static sessionsControllerCreate(
        requestBody: CreateSessionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get session by ID
     * @param id
     * @returns any Session details
     * @throws ApiError
     */
    public static sessionsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sessions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update session
     * @param id
     * @param requestBody
     * @returns any Session updated
     * @throws ApiError
     */
    public static sessionsControllerUpdate(
        id: string,
        requestBody: UpdateSessionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/sessions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete session
     * @param id
     * @returns any Session deleted
     * @throws ApiError
     */
    public static sessionsControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/sessions/{id}',
            path: {
                'id': id,
            },
        });
    }
}
