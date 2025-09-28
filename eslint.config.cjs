const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = [
	{ ignores: ["dist/**"] },
	// Base JavaScript configuration
	js.configs.recommended,
	// Configuration for CommonJS files - only JS rules, no TypeScript
	{
		files: ["**/*.cjs"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	// TypeScript configuration for TS/JS files (excludes .cjs files)
	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ["**/*.ts", "**/*.js", "**/*.mts", "**/*.mjs"],
	})),
	// Additional rules for TypeScript and modern JS
	{
		files: ["**/*.ts", "**/*.js", "**/*.mts", "**/*.mjs"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2020,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": "error",
		},
	},
];
