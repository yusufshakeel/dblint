import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            "coverage/**",
            "data/**",
            "db/**",
            "dist/**",
            "node_modules/**",
            "output/**",
            "reports/**",
            "*.config.{js,cjs,mjs,ts}",
            "knexfile.js",
        ],
    },

    // Base JS config
    js.configs.recommended,

    // TypeScript configs
    ...tseslint.configs.recommended,

    // If you want type-aware linting (slower, uses your tsconfig):
    // ...tseslint.configs.recommendedTypeChecked,
    // {
    //   languageOptions: {
    //     parserOptions: {
    //       project: true, // picks up your tsconfig.json
    //       tsconfigRootDir: import.meta.dirname,
    //     },
    //   },
    // },

    // Prettier compatibility — turns off formatting rules in ESLint
    {
        rules: {
            ...tseslint.configs.disableTypeChecked.rules,

            // new line at end of file
            "eol-last": ["error", "always"],

            // Prefer TS-specific rules, disable overlapping core rules
            "no-unused-vars": "off",
            "no-use-before-define": "off",

            // TypeScript rules
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: ".*",
                    varsIgnorePattern: ".*",
                },
            ],
            "@typescript-eslint/no-use-before-define": [
                "error",
                {
                    functions: false,
                    variables: false,
                },
            ],

            // Core rules (behavior/stylistic)
            strict: ["error", "global"],
            "no-console": ["error", { allow: ["error", "log"] }],
            "new-cap": "off",
            "no-var": "error",
            indent: ["error", 2],
            "linebreak-style": ["error", "unix"],
            quotes: [
                "error",
                "single",
                { allowTemplateLiterals: true, avoidEscape: true },
            ],
            "no-tabs": "off",
            semi: ["error", "always"],
            "arrow-parens": ["error", "as-needed"],
            "max-len": [
                "error",
                {
                    code: 100,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            "comma-dangle": [
                "error",
                {
                    arrays: "never",
                    objects: "never",
                    imports: "never",
                    exports: "never",
                    functions: "never",
                },
            ],
            "space-before-function-paren": [
                "error",
                { anonymous: "always", named: "never" },
            ],
            "brace-style": ["error", "1tbs", { allowSingleLine: true }],
            "quote-props": ["error", "as-needed", { keywords: true }],
            "object-curly-spacing": ["error", "always"],
            complexity: ["error", 20],
        },
    },
];