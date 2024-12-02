import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  rootDir: './src',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/*.test.ts'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '../tests/**/*.{ts,tsx}'],
  coverageDirectory: '../coverage', 
  coverageProvider: 'v8',

};

export default config;
