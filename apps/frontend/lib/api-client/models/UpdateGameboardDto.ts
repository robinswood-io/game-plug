/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type UpdateGameboardDto = {
    /**
     * Session ID for the gameboard
     */
    sessionId?: string;
    /**
     * Gameboard title
     */
    title?: string;
    /**
     * Gameboard description
     */
    description?: string;
    /**
     * Character IDs to include
     */
    characterIds?: Array<string>;
    /**
     * Initial state or configuration (JSON)
     */
    state?: Record<string, any>;
};

