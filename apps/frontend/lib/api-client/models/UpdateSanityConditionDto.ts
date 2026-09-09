/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type UpdateSanityConditionDto = {
    /**
     * Character ID associated with this condition
     */
    characterId?: string;
    /**
     * Type of sanity condition
     */
    type?: UpdateSanityConditionDto.type;
    /**
     * Name of the sanity condition
     */
    name?: string;
    /**
     * Detailed description of the condition
     */
    description?: string;
    /**
     * Duration type
     */
    duration?: UpdateSanityConditionDto.duration;
    /**
     * Whether the condition is currently active
     */
    isActive?: boolean;
};
export namespace UpdateSanityConditionDto {
    /**
     * Type of sanity condition
     */
    export enum type {
        PHOBIA = 'phobia',
        MANIA = 'mania',
        TEMPORARY_INSANITY = 'temporary_insanity',
        INDEFINITE_INSANITY = 'indefinite_insanity',
    }
    /**
     * Duration type
     */
    export enum duration {
        TEMPORARY = 'temporary',
        INDEFINITE = 'indefinite',
        PERMANENT = 'permanent',
    }
}

