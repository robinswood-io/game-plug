/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type SignupDto = {
    /**
     * User email address (must be unique)
     */
    email: string;
    /**
     * Password (8-128 chars, 1 uppercase, 1 digit, 1 special char)
     */
    password: string;
    /**
     * First name (2-50 characters)
     */
    firstName: string;
    /**
     * Last name (2-50 characters)
     */
    lastName: string;
};

