/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCharacterDto = {
    /**
     * Character name
     */
    name: string;
    /**
     * Session ID
     */
    sessionId: string;
    /**
     * Character occupation
     */
    occupation: string;
    /**
     * Strength (1-99)
     */
    strength: number;
    /**
     * Constitution (1-99)
     */
    constitution: number;
    /**
     * Size (1-99)
     */
    size: number;
    /**
     * Dexterity (1-99)
     */
    dexterity: number;
    /**
     * Appearance (1-99)
     */
    appearance: number;
    /**
     * Intelligence (1-99)
     */
    intelligence: number;
    /**
     * Power (1-99)
     */
    power: number;
    /**
     * Education (1-99)
     */
    education: number;
    /**
     * Luck (1-99)
     */
    luck: number;
    /**
     * Hit points
     */
    hitPoints: number;
    /**
     * Maximum hit points
     */
    maxHitPoints: number;
    /**
     * Sanity (0-99)
     */
    sanity: number;
    /**
     * Maximum sanity (0-99)
     */
    maxSanity: number;
    /**
     * Magic points
     */
    magicPoints: number;
    /**
     * Maximum magic points
     */
    maxMagicPoints: number;
    /**
     * Character age
     */
    age?: number;
    /**
     * Birthplace
     */
    birthplace?: string;
    /**
     * Current residence
     */
    residence?: string;
    /**
     * Gender
     */
    gender?: string;
    /**
     * Height
     */
    height?: string;
    /**
     * Build
     */
    build?: string;
    /**
     * Hair color
     */
    hairColor?: string;
    /**
     * Eye color
     */
    eyeColor?: string;
    /**
     * Avatar URL
     */
    avatarUrl?: string;
    /**
     * Prompt for AI avatar generation
     */
    avatarPrompt?: string;
    /**
     * Character skills (key-value pairs)
     */
    skills?: Record<string, any>;
    /**
     * Player notes
     */
    notes?: string;
    /**
     * Starting money
     */
    money?: string;
    /**
     * User ID (owner)
     */
    userId?: string;
};

