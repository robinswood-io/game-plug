/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInventoryDto } from '../models/CreateInventoryDto';
import type { UpdateInventoryDto } from '../models/UpdateInventoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InventoryService {
    /**
     * Get inventory for character
     * @param characterId
     * @returns any Character inventory
     * @throws ApiError
     */
    public static inventoryControllerFindByCharacter(
        characterId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/inventory',
            query: {
                'characterId': characterId,
            },
        });
    }
    /**
     * Create inventory item
     * @param requestBody
     * @returns any Inventory item created
     * @throws ApiError
     */
    public static inventoryControllerCreate(
        requestBody: CreateInventoryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/inventory',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update inventory item
     * @param id
     * @param requestBody
     * @returns any Inventory item updated
     * @throws ApiError
     */
    public static inventoryControllerUpdate(
        id: string,
        requestBody: UpdateInventoryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/inventory/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete inventory item
     * @param id
     * @returns any Inventory item deleted
     * @throws ApiError
     */
    public static inventoryControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/inventory/{id}',
            path: {
                'id': id,
            },
        });
    }
}
