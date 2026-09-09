/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { GenerateAvatarDto } from '../models/GenerateAvatarDto';
import type { GenerateSceneDto } from '../models/GenerateSceneDto';
import type { SuggestNarrativeDto } from '../models/SuggestNarrativeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiService {
    /**
     * Generate an AI avatar image for a character
     * Uses AI to generate a character portrait based on physical description and attributes
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static aiControllerGenerateAvatar(
        requestBody: GenerateAvatarDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/generate-avatar',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Generate an AI scene image
     * Creates an atmospheric scene image based on description, location, and mood
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static aiControllerGenerateScene(
        requestBody: GenerateSceneDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/generate-scene',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get AI narrative suggestions
     * Generates narrative suggestions based on current game context and recent events
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static aiControllerSuggestNarrative(
        requestBody: SuggestNarrativeDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/suggest-narrative',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
