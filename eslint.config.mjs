import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/** R3F/Three.js patterns (mutable refs, scene graph, Math.random init) trip these React Compiler–oriented rules. */
const reactHooksCompat = {
  "react-hooks/purity": "off",
  "react-hooks/immutability": "off",
  "react-hooks/refs": "off",
  "react-hooks/set-state-in-effect": "off",
};

const config = [...nextCoreWebVitals, { rules: reactHooksCompat }];

export default config;
