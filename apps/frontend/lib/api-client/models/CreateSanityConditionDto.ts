/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSanityConditionDto = {
    /**
     * Character ID associated with this condition
     */
    characterId: string;
    /**
     * Type of sanity condition
     */
    type: CreateSanityConditionDto.type;
    /**
     * Name of the sanity condition
     */
    name: string;
    /**
     * Detailed description of the condition
     */
    description?: string;
    /**
     * Duration type
     */
    duration?: CreateSanityConditionDto.duration;
    /**
     * Whether the condition is currently active
     */
    isActive?: boolean;
};
export namespace CreateSanityConditionDto {
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

