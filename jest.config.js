module.exports = {
  roots: ['tests'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    "html",
    "json-summary",
    "text-summary"
  ],
};