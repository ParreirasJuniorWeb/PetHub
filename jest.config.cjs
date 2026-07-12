module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/functions/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: ["functions/src/**/*.ts", "!functions/src/**/*.d.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/functions/tsconfig.json",
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
