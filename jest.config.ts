// jest.config.js
module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"]
};
