// Architecture tests using tsarch to enforce vertical slice boundaries.
// Each feature slice (students, teachers, classes, admin) must only depend on:
//  - its own slice files
//  - shared layer (src/shared/**)
// Shared layer must NOT depend on any feature slice.
// There must be no circular dependencies anywhere.
// Adjust or extend rules here as new slices are added.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { filesOfProject } from 'tsarch';

// Utility list of feature slice names for rule generation.
const featureSlices = ['students', 'teachers', 'classes', 'admin'];

describe('Architecture – Vertical Slice boundaries', () => {
  featureSlices.forEach((slice) => {
    test(`${slice} slice should not depend on other feature slices`, async () => {
      const base = filesOfProject()
        .matchingPattern(`src/features/${slice}/.*\\.ts`)
        .shouldNot()
        .dependOnFiles();
      const finalBuilder = featureSlices
        .filter((s) => s !== slice)
        .reduce(
          (acc: any, other) => acc.matchingPattern(`src/features/${other}/.*\\.ts`),
          base as any
        );
      await expect(finalBuilder).toPassAsync();
    });
  });

  test('Shared must not depend on any feature slice', async () => {
    const base = filesOfProject().matchingPattern('src/shared/.*\\.ts').shouldNot().dependOnFiles();
    const finalBuilder = featureSlices.reduce(
      (acc: any, slice) => acc.matchingPattern(`src/features/${slice}/.*\\.ts`),
      base as any
    );
    await expect(finalBuilder).toPassAsync();
  });

  test('No circular dependencies anywhere', async () => {
    await expect(
      filesOfProject().matchingPattern('src/.*\\.ts').should().beFreeOfCycles()
    ).toPassAsync();
  });
});

describe('Architecture – Controllers should not import repositories directly', () => {
  test('Controllers do not directly depend on repository implementations', async () => {
    await expect(
      filesOfProject()
        .matchingPattern('src/features/.+/.+Controller\\.ts')
        .shouldNot()
        .dependOnFiles()
        .matchingPattern('src/shared/Infrastructure/repositories/.*\\.ts')
    ).toPassAsync();
  });
});
