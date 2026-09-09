/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChaptersService {
    /**
     * Get chapters for session
     * @param sessionId
     * @returns any List of chapters
     * @throws ApiError
     */
    public static chaptersControllerFindBySession(
        sessionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chapters',
            query: {
                'sessionId': sessionId,
            },
        });
    }
    /**
     * Create new chapter
     * @returns any Chapter created
     * @throws ApiError
     */
    public static chaptersControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chapters',
        });
    }
    /**
     * Get chapter by ID
     * @param id
     * @returns any Chapter details
     * @throws ApiError
     */
    public static chaptersControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chapters/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update chapter
     * @param id
     * @returns any Chapter updated
     * @throws ApiError
     */
    public static chaptersControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/chapters/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete chapter
     * @param id
     * @returns any Chapter deleted
     * @throws ApiError
     */
    public static chaptersControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/chapters/{id}',
            path: {
                'id': id,
            },
        });
    }
}
