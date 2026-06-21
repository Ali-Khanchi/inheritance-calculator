import React from 'react';
import { calculateFirstGroupInheritance } from '../util/first-group-calculation';
import { firstGroupExamples } from '../util/first-group-examples';
import { secondGroupExamples } from '../util/second-group-examples';

const CalculatorExamples: React.FC = () => {
  const subCategories = Array.from(
    new Set(firstGroupExamples.map((e) => e.subCategory))
  );

  const secondSubCategories = Array.from(
    new Set(secondGroupExamples.map((e) => e.subCategory))
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 font-sans antialiased">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
            Case Distribution Examples
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pre-calculated reference guides for Group 1 heirs
          </p>
        </header>

        {subCategories.map((subCat) => (
          <div key={subCat} className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
              {subCat}
            </h3>

            <div className="flex flex-col gap-3">
              {firstGroupExamples
                .filter((e) => e.subCategory === subCat)
                .map((example, idx) => {
                  const res = calculateFirstGroupInheritance(example.inputs);
                  console.log(res);

                  const activeShares = [
                    { label: 'Father', val: res.father },
                    { label: 'Mother', val: res.mother },
                    { label: 'Husband', val: res.husband },
                    { label: 'Wife (each)', val: res.wife },
                    {
                      label: 'Son (each)',
                      val: (example.inputs.sons ?? 0 > 0) ? res.son : 0
                    },
                    {
                      label: 'Daughter (each)',
                      val:
                        (example.inputs.daughters ?? 0 > 0) ? res.daughter : 0
                    },
                    { label: 'Musalahah', val: res.settlement }
                  ].filter((s) => s.val > 0);

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition hover:border-slate-300"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          {example.title}
                        </h4>
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Total: {res.total}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Inputs:
                        </span>
                        {Object.entries(example.inputs)
                          .filter(
                            ([_, val]) =>
                              val !== undefined &&
                              val !== null &&
                              (typeof val === 'number' ? val > 0 : val)
                          )
                          .map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[11px] bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                            >
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                              :{' '}
                              <span className="font-semibold text-slate-900">
                                {String(val)}
                              </span>
                            </span>
                          ))}
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                        {activeShares.map((share, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex justify-between border-b border-slate-200/60 pb-1 sm:pb-0"
                          >
                            <span className="text-slate-500">
                              {share.label}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {share.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
        {/* Add this section right below the first group's mapping block */}
        <header className="mb-8 mt-12 text-center border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
            Second Group Inheritance Examples
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pre-calculated reference guides for Group 2 heirs (Siblings &
            Grandparents)
          </p>
        </header>

        {secondSubCategories.map((subCat) => (
          <div key={subCat} className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
              {subCat}
            </h3>

            <div className="flex flex-col gap-3">
              {secondGroupExamples
                .filter((e) => e.subCategory === subCat)
                .map((example, idx) => {
                  // Fallback to example.expected if a calculation function isn't invoked here
                  const res = example.expected;

                  // Dynamically map fields to avoid hardcoding unknown Group 2 keys
                  const activeShares = Object.entries(res)
                    .filter(
                      ([key, val]) =>
                        key !== 'total' && typeof val === 'number' && val > 0
                    )
                    .map(([key, val]) => ({
                      label: key
                        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                        .replace(/^./, (str) => str.toUpperCase()), // Capitalize first letter
                      val: val as number
                    }));

                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition hover:border-slate-300"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                          {example.title}
                        </h4>
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Total: {res.total}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Inputs:
                        </span>
                        {Object.entries(example.inputs)
                          .filter(
                            ([_, val]) =>
                              val !== undefined &&
                              val !== null &&
                              (typeof val === 'number' ? val > 0 : val)
                          )
                          .map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[11px] bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                            >
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                              :{' '}
                              <span className="font-semibold text-slate-900">
                                {String(val)}
                              </span>
                            </span>
                          ))}
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                        {activeShares.map((share, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex justify-between border-b border-slate-200/60 pb-1 sm:pb-0"
                          >
                            <span className="text-slate-500">
                              {share.label}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {share.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorExamples;
