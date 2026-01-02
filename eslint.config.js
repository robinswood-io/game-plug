import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Base configuration
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // TypeScript configuration with project
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        node: true,
        es2022: true,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ==========================================
  // STRICT MAXIMUM CONFIGURATION
  // ==========================================
  {
    files: ['server/**/*.ts', 'client/src/**/*.{ts,tsx}', 'shared/**/*.ts'],
    rules: {
      // ==========================================
      // TYPESCRIPT - STRICT RULES
      // ==========================================
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/strict-boolean-expressions': ['warn', {
        allowString: true,
        allowNumber: true,
        allowNullableObject: true,
      }],

      // ==========================================
      // CODE QUALITY
      // ==========================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'complexity': ['error', 20],
      'max-depth': ['error', 4],
      'max-lines-per-function': ['warn', {
        max: 150,
        skipBlankLines: true,
        skipComments: true,
      }],
      'max-lines': ['warn', {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      }],
      'max-params': ['warn', 5],

      // ==========================================
      // BUG PREVENTION
      // ==========================================
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-unused-expressions': 'error',
      'require-atomic-updates': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // ==========================================
      // BEST PRACTICES
      // ==========================================
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'no-throw-literal': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn', // Permitted but with warning
    },
  },

  // Configuration for tests (more lenient rules)
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'no-console': 'off',
    },
  },

  // Configuration for scripts and seeders
  {
    files: ['**/scripts/**/*.ts', '**/seeders/**/*.ts', '**/migration/**/*.ts'],
    rules: {
      'no-console': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // Ignore certain files
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'test-results/**',
      '*.config.js',
      '*.config.ts',
      'migrations/**',
      'drizzle/**',
      '.husky/**',
    ],
  },
];
