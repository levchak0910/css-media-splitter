// eslint.config.js
import antfu from "@antfu/eslint-config"

export default antfu({
  stylistic: {
    quotes: "double",
  },
  rules: {
    "node/prefer-global/buffer": ["error", "always"],
    "perfectionist/sort-imports": "off",
    "perfectionist/sort-named-exports": "off",
    "perfectionist/sort-exports": "off",
  },
})
