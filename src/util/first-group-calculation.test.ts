import { describe, test, expect } from 'vitest';
import { calculateFirstGroupInheritance } from './first-group-calculation';
import { firstGroupExamples } from './first-group-examples';

describe('calculateFirstGroupInheritance() Islamic Inheritance of First Group', () => {
  // Groups the static data by its target category name
  const subCategories = Array.from(
    new Set(firstGroupExamples.map((e) => e.subCategory))
  );

  subCategories.forEach((subCat) => {
    describe(subCat, () => {
      const examplesInSubCat = firstGroupExamples.filter(
        (e) => e.subCategory === subCat
      );

      examplesInSubCat.forEach((example) => {
        test(example.title, () => {
          const result = calculateFirstGroupInheritance(example.inputs);

          // Dynamically verify all parameters defined inside the expectation object block
          Object.entries(example.expected).forEach(([key, expectedValue]) => {
            expect(result[key as keyof typeof result]).toBe(expectedValue);
          });
        });
      });
    });
  });
});
