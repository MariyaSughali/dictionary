module.exports = {
  globals: {
    "ts-jest": {
      skipBabel: true,
    },
  },
  moduleFileExtensions: ["js", "ts"],
  testResultsProcessor: "jest-sonar-reporter",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["<rootDir>/__test__/*.test.js"],
};
