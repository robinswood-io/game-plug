/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SuggestNarrativeDto = {
    /**
     * Session ID for context
     */
    sessionId: string;
    /**
     * Current situation or context
     */
    context: string;
    /**
     * Recent events or actions taken
     */
    recentEvents?: Array<string>;
    /**
     * Character names involved
     */
    characters?: Array<string>;
    /**
     * Desired tone (horror, mystery, action, etc.)
     */
    tone?: string;
    /**
     * Number of suggestions to generate
     */
    suggestionCount?: string;
};

