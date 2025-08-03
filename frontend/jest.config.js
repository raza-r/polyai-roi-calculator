export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/e2e/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/e2e/setup.ts'],
  testTimeout: 30000,
};