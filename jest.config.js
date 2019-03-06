module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "wasm"],
  rootDir: "src/",
  transform: {
    "^.+\\.rs$": "rs-jest",
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
};
