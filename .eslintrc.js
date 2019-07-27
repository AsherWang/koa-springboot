module.exports = {
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
        semi: "error"
    }
}
