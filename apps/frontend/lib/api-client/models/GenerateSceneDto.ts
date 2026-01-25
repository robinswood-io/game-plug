/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GenerateSceneDto = {
    /**
     * Scene title or theme
     */
    title: string;
    /**
     * Scene description or context
     */
    description: string;
    /**
     * Location of the scene
     */
    location?: string;
    /**
     * Time period (e.g., 1920s, modern, Victorian)
     */
    timePeriod?: string;
    /**
     * Mood or atmosphere (e.g., tense, mysterious, calm)
     */
    mood?: string;
    /**
     * Characters present in the scene
     */
    characters?: Array<string>;
};

