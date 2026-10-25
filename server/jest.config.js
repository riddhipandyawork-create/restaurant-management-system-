module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  verbose: true,
  testTimeout: 20000,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
