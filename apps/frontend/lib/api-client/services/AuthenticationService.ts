/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { LoginDto } from '../models/LoginDto';
import type { SignupDto } from '../models/SignupDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register a new user
     * @param requestBody
     * @returns any User registered successfully
     * @throws ApiError
     */
    public static authControllerSignup(
        requestBody: SignupDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input data`,
            },
        });
    }
    /**
     * Login with email and password
     * @param requestBody
     * @returns any Login successful, returns JWT token
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }
    /**
     * Refresh JWT token
     * @returns any Token refreshed successfully
     * @throws ApiError
     */
    public static authControllerRefresh(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
            errors: {
                401: `Invalid or expired refresh token`,
            },
        });
    }
}
