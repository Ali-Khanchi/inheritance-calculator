import React, { useState } from 'react';
import { calculateFirstGroupInheritance } from '../util/first-group-calculation';
import { firstGroupExamples } from '../util/first-group-examples';
import { secondGroupExamples } from '../util/second-group-examples';

const CalculatorExamples: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const subCategories = Array.from(
    new Set(firstGroupExamples.map((e) => e.subCategory))
  );

  const secondSubCategories = Array.from(
    new Set(secondGroupExamples.map((e) => e.subCategory))
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased flex">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 z-50 md:hidden flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition"
        aria-label="Toggle Navigation Menu"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-slate-200 p-5 transition-transform duration-300 md:translate-x-0 md:sticky ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 text-sm"
          >
            Close
          </button>
        </div>

        <nav className="space-y-6">
          {/* Group 1 Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Group 1 Heirs
            </h4>
            <ul className="space-y-1 border-l border-slate-100 pl-2">
              {subCategories.map((subCat) => (
                <li key={subCat}>
                  <a
                    href={`#g1-${subCat.replace(/\s+/g, '-')}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-xs py-1.5 text-slate-600 hover:text-slate-900 font-medium truncate transition"
                  >
                    {subCat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 2 Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Group 2 Heirs
            </h4>
            <ul className="space-y-1 border-l border-slate-100 pl-2">
              {secondSubCategories.map((subCat) => (
                <li key={subCat}>
                  <a
                    href={`#g2-${subCat.replace(/\s+/g, '-')}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-xs py-1.5 text-slate-600 hover:text-slate-900 font-medium truncate transition"
                  >
                    {subCat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Backdrop for mobile view when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Pane */}
      <main className="flex-1 px-4 py-8 overflow-x-hidden md:pr-64">
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
            <div
              key={subCat}
              id={`g1-${subCat.replace(/\s+/g, '-')}`}
              className="mb-8 scroll-mt-6"
            >
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
            <div
              key={subCat}
              id={`g2-${subCat.replace(/\s+/g, '-')}`}
              className="mb-8 scroll-mt-6"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
                {subCat}
              </h3>

              <div className="flex flex-col gap-3">
                {secondGroupExamples
                  .filter((e) => e.subCategory === subCat)
                  .map((example, idx) => {
                    const res = example.expected;

                    const activeShares = Object.entries(res)
                      .filter(
                        ([key, val]) =>
                          key !== 'total' && typeof val === 'number' && val > 0
                      )
                      .map(([key, val]) => ({
                        label: key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase()),
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
      </main>
    </div>
  );
};

export default CalculatorExamples;
