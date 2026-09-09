/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChapterEventsService {
    /**
     * Get chapter events
     * @param chapterId
     * @param sessionId
     * @returns any List of chapter events
     * @throws ApiError
     */
    public static chapterEventsControllerFind(
        chapterId: string,
        sessionId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chapter-events',
            query: {
                'chapterId': chapterId,
                'sessionId': sessionId,
            },
        });
    }
    /**
     * Create new chapter event
     * @returns any Chapter event created
     * @throws ApiError
     */
    public static chapterEventsControllerCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chapter-events',
        });
    }
    /**
     * Get chapter event by ID
     * @param id
     * @returns any Chapter event details
     * @throws ApiError
     */
    public static chapterEventsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chapter-events/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update chapter event
     * @param id
     * @returns any Chapter event updated
     * @throws ApiError
     */
    public static chapterEventsControllerUpdate(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/chapter-events/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete chapter event
     * @param id
     * @returns any Chapter event deleted
     * @throws ApiError
     */
    public static chapterEventsControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/chapter-events/{id}',
            path: {
                'id': id,
            },
        });
    }
}
