import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateFirstGroupInheritance } from '../util/first-group-calculation';
import { firstGroupExamples } from '../util/first-group-examples';
import { secondGroupExamples } from '../util/second-group-examples';

const CalculatorExamples: React.FC = () => {
  // 2. Consume the context hooks
  const { t, isRtl } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const subCategories = Array.from(
    new Set(firstGroupExamples.map((e) => e.subCategory))
  );

  const secondSubCategories = Array.from(
    new Set(secondGroupExamples.map((e) => e.subCategory))
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased flex">
      {/* Sidebar Toggle Button for Mobile - Changed right-4 to end-4 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 end-4 z-50 md:hidden flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition"
        aria-label="Toggle Navigation Menu"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Navigation - Changed left-0 to start-0, border-r to border-e, and handled conditional RTL translation direction */}
      <aside
        className={`fixed top-0 start-0 z-40 w-64 h-screen bg-white border-e border-slate-200 p-5 transition-transform duration-300 md:translate-x-0 md:sticky ${
          isSidebarOpen
            ? 'translate-x-0'
            : isRtl
              ? 'translate-x-full'
              : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t('Navigation')}
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 text-sm"
          >
            {t('Close')}
          </button>
        </div>

        <nav className="space-y-6">
          {/* Group 1 Links - Changed border-l to border-s, pl-2 to ps-2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              {t('Group 1 Heirs')}
            </h4>
            <ul className="space-y-1 border-s border-slate-100 pl-2">
              {subCategories.map((subCat) => (
                <li key={subCat}>
                  <a
                    href={`#g1-${subCat.replace(/\s+/g, '-')}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-xs py-1.5 text-slate-600 hover:text-slate-900 font-medium truncate transition"
                  >
                    {t(subCat)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 2 Links - Changed border-l to border-s, pl-2 to ps-2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              {t('Group 2 Heirs')}
            </h4>
            <ul className="space-y-1 border-s border-slate-100 pl-2">
              {secondSubCategories.map((subCat) => (
                <li key={subCat}>
                  <a
                    href={`#g2-${subCat.replace(/\s+/g, '-')}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-xs py-1.5 text-slate-600 hover:text-slate-900 font-medium truncate transition"
                  >
                    {t(subCat)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Backdrop for mobile view */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Pane - Changed md:pr-64 to md:pe-64 */}
      <main className="flex-1 px-4 py-8 overflow-x-hidden md:pe-64">
        <div className="mx-auto max-w-2xl">
          <header className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              {t('Case Distribution Examples')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t('Pre-calculated reference guides for Group 1 heirs')}
            </p>
          </header>

          {subCategories.map((subCat) => (
            <div
              key={subCat}
              id={`g1-${subCat.replace(/\s+/g, '-')}`}
              className="mb-8 scroll-mt-6"
            >
              {/* Changed pl-1 to ps-1 */}
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ps-1">
                {t(subCat)}
              </h3>

              <div className="flex flex-col gap-3">
                {firstGroupExamples
                  .filter((e) => e.subCategory === subCat)
                  .map((example, idx) => {
                    const res = calculateFirstGroupInheritance(example.inputs);

                    const activeShares = [
                      { label: 'Father', val: res.father },
                      { label: 'Mother', val: res.mother },
                      { label: 'Husband', val: res.husband },
                      { label: 'Wife (each)', val: res.wife },
                      {
                        label: 'Son (each)',
                        val: (example.inputs.sons ?? 0) > 0 ? res.son : 0
                      },
                      {
                        label: 'Daughter (each)',
                        val:
                          (example.inputs.daughters ?? 0) > 0 ? res.daughter : 0
                      },
                      { label: 'Musalahah', val: res.settlement }
                    ].filter((s) => s.val > 0);

                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition hover:border-slate-300"
                      >
                        {/* Locate this card title header block inside firstGroupExamples.map */}
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                            {t(example.title)}{' '}
                            {/* ADDED THE t() WRAPPER HERE */}
                          </h4>
                          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            {t('Total')}: {res.total}
                          </span>
                        </div>

                        {/* Changed mr-1 to me-1 */}
                        <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider me-1">
                            {t('Inputs:')}
                          </span>
                          {Object.entries(example.inputs)
                            .filter(
                              ([_, val]) =>
                                val !== undefined &&
                                val !== null &&
                                (typeof val === 'number' ? val > 0 : val)
                            )
                            .map(([key, val]) => {
                              const formattedKey = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase());
                              return (
                                <span
                                  key={key}
                                  className="text-[11px] bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                                >
                                  {t(formattedKey)}:{' '}
                                  <span className="font-semibold text-slate-900">
                                    {String(val)}
                                  </span>
                                </span>
                              );
                            })}
                        </div>

                        <div className="bg-slate-50 rounded-lg p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                          {activeShares.map((share, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex justify-between border-b border-slate-200/60 pb-1 sm:pb-0"
                            >
                              <span className="text-slate-500">
                                {t(share.label)}
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
              {t('Second Group Inheritance Examples')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t(
                'Pre-calculated reference guides for Group 2 heirs (Siblings & Grandparents)'
              )}
            </p>
          </header>

          {secondSubCategories.map((subCat) => (
            <div
              key={subCat}
              id={`g2-${subCat.replace(/\s+/g, '-')}`}
              className="mb-8 scroll-mt-6"
            >
              {/* Changed pl-1 to ps-1 */}
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
                {t(subCat)}
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
                        {/* Locate this card title header block inside secondGroupExamples.map */}
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h4 className="text-sm font-semibold text-slate-800 leading-snug">
                            {t(example.title)}{' '}
                            {/* ADDED THE t() WRAPPER HERE */}
                          </h4>
                          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            {t('Total')}: {res.total}
                          </span>
                        </div>

                        {/* Changed mr-1 to me-1 */}
                        <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider me-1">
                            {t('Inputs:')}
                          </span>
                          {Object.entries(example.inputs)
                            .filter(
                              ([_, val]) =>
                                val !== undefined &&
                                val !== null &&
                                (typeof val === 'number' ? val > 0 : val)
                            )
                            .map(([key, val]) => {
                              const formattedKey = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase());
                              return (
                                <span
                                  key={key}
                                  className="text-[11px] bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                                >
                                  {t(formattedKey)}:{' '}
                                  <span className="font-semibold text-slate-900">
                                    {String(val)}
                                  </span>
                                </span>
                              );
                            })}
                        </div>

                        <div className="bg-slate-50 rounded-lg p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                          {activeShares.map((share, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex justify-between border-b border-slate-200/60 pb-1 sm:pb-0"
                            >
                              <span className="text-slate-500">
                                {t(share.label)}
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
