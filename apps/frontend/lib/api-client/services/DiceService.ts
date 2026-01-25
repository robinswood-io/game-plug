/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiceRollDto } from '../models/DiceRollDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiceService {
    /**
     * Roll dice
     * @param requestBody
     * @returns any Dice roll result
     * @throws ApiError
     */
    public static diceControllerRoll(
        requestBody: DiceRollDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dice/roll',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
