module.exports = {
  preset: "ts-jest",
  testEnvironment: "./fix-jsdom-env.ts",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};
