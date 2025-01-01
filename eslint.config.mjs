import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enable no-explicit-any rule to avoid using `any` type
      "@typescript-eslint/no-explicit-any": "warn",

      // Allow the use of `import.meta` (ESM-specific)
      "no-restricted-globals": [
        "error",
        {
          name: "import.meta",
          message: "Use import.meta only in ESM contexts.",
        },
      ],

      // Additional common rules
      "no-unused-vars": "warn", // Warn on unused variables
      "no-console": "warn", // Warn on console.log
      "prefer-const": "error", // Enforce the use of const where applicable
    },
  },
];

export default eslintConfig;
