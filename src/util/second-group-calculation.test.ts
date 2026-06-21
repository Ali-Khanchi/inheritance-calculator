import { describe, test, expect } from 'vitest';
import { calculateSecondGroupInheritance } from './second-group-calculation';
import { secondGroupExamples } from './second-group-examples';

describe('calculateSecondGroupInheritance() Islamic Inheritance of Second Group', () => {
  const subCategories = Array.from(
    new Set(secondGroupExamples.map((e) => e.subCategory))
  );

  subCategories.forEach((subCat) => {
    describe(subCat, () => {
      const examplesInSubCat = secondGroupExamples.filter(
        (e) => e.subCategory === subCat
      );

      examplesInSubCat.forEach((example) => {
        test(example.title, () => {
          const result = calculateSecondGroupInheritance(example.inputs);

          Object.entries(example.expected).forEach(([key, expectedValue]) => {
            expect(result[key as keyof typeof result]).toBe(expectedValue);
          });
        });
      });
    });
  });
});
