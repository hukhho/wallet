// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;


module.exports = {
  rules: {
    "@typescript-eslint/ban-ts-comment": "off", // Allows @ts-ignore
    "@typescript-eslint/no-unused-vars": "warn", // Prevents breaking errors on unused vars
    "no-console": "off", // Allows console.log
  },
};
