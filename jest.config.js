module.exports = {
  roots: ['src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: [
    "html",
    "json-summary",
    "text-summary"
  ],
};