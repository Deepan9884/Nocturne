import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  {
    rules: {
      "no-unused-vars": "off",
    },
  },
  globalIgnores([
    "dist/**",
    "node_modules/**",
    ".agents/**",
    "scratch/**",
  ]),
]);

export default eslintConfig;
