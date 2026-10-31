import JSZip from 'jszip';
import { REPO_FILES } from '../data/repoFiles.js';

export async function downloadRepoZip(): Promise<void> {
  const zip = new JSZip();

  // Add each file into the zip archive matching its relative path
  REPO_FILES.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Also include Jest configuration and ESLint configuration
  zip.file(
    'jest.config.cjs',
    `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
};`
  );

  zip.file(
    'eslint.config.js',
    `export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'off',
    },
  },
];`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'devops-reproducible-ci-repo.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}