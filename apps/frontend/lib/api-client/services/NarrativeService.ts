/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NarrativeService {
    /**
     * Get narrative elements for session
     * @param sessionId
     * @returns any Narrative elements
     * @throws ApiError
     */
    public static narrativeControllerFindBySession(
        sessionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/narrative',
            query: {
                'sessionId': sessionId,
            },
        });
    }
    /**
     * Create narrative element
     * @returns any Narrative element created
     * @throws ApiError
     */
    public static narrativeControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/narrative',
        });
    }
    /**
     * Update narrative element
     * @param id
     * @returns any Narrative element updated
     * @throws ApiError
     */
    public static narrativeControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/narrative/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete narrative element
     * @param id
     * @returns any Narrative element deleted
     * @throws ApiError
     */
    public static narrativeControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/narrative/{id}',
            path: {
                'id': id,
            },
        });
    }
}
