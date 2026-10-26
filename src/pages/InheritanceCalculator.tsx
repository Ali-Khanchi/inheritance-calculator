import React, { useState, ChangeEvent } from 'react';
import {
  calculateFirstGroupInheritance,
  FirstHeirsState
} from '../util/first-group-calculation';
import {
  calculateSecondGroupInheritance,
  SecondHeirsState
} from '../util/second-group-calculation';
import InheritanceGraph from '../components/InheritanceGraph';

const cardStyle =
  'bg-white px-3.5 py-2.5 rounded-xl mb-2 shadow-[0_1px_4px_rgba(0,0,0,0.05)] border-[0.5px] border-[#e2e8f0]';
const dividerStyle = 'border-t-[0.5px] border-[#f1f5f9]';
const stepperBtnStyle =
  'w-8 h-8 text-[18px] bg-[#f1f5f9] border-[0.5px] border-[#cbd5e1] rounded-lg flex items-center justify-center cursor-pointer touch-none select-none leading-none';
const labelStyle = 'text-[16px] text-[#334155] font-medium';
const checkboxStyle = 'w-6 h-6 accent-[#2563eb]';
const tabBaseStyle =
  'flex-1 py-2 px-1 rounded-lg font-medium text-[16px] cursor-pointer';
const tabActiveStyle = `${tabBaseStyle} border-[1.5px] border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]`;
const tabInactiveStyle = `${tabBaseStyle} border-[0.5px] border-[#e2e8f0] bg-white text-[#64748b]`;

const InheritanceCalculator: React.FC = () => {
  const [heirs, setHeirs] = useState<FirstHeirsState>({
    fatherAlive: true,
    motherAlive: true,
    hasSC: false,
    wives: 1,
    husband: false,
    deceasedIsMale: true,
    sons: 2,
    daughters: 2
  });

  const [secondHeirs, setSecondHeirs] = useState<SecondHeirsState>({
    deceasedIsFemale: false,
    wives: 0,
    hasHusband: false,
    fullBrothers: 0,
    fullSisters: 0,
    paternalBrothers: 0,
    paternalSisters: 0,
    maternalBrothers: 0,
    maternalSisters: 0,
    paternalGrandpa: false,
    paternalGrandma: false,
    maternalGrandpa: false,
    maternalGrandma: false
  });

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<'first' | 'second'>('first');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const targetValue =
      type === 'checkbox' ? checked : Math.max(0, parseInt(value) || 0);

    if (activeGroup === 'first') {
      setHeirs((prev) => ({ ...prev, [name]: targetValue }));
    } else {
      const targetName = name === 'husband' ? 'hasHusband' : name;
      setSecondHeirs((prev) => ({ ...prev, [targetName]: targetValue }));
    }
  };

  const updateCount = (name: string, delta: number) => {
    if (activeGroup === 'first') {
      setHeirs((prev) => ({
        ...prev,
        [name]: Math.max(
          0,
          (prev[name as keyof FirstHeirsState] as number) + delta
        )
      }));
    } else {
      setSecondHeirs((prev) => ({
        ...prev,
        [name]: Math.max(
          0,
          (prev[name as keyof SecondHeirsState] as number) + delta
        )
      }));
    }
  };

  const firstRes = calculateFirstGroupInheritance(heirs);
  const secondRes = calculateSecondGroupInheritance(secondHeirs);

  const showSiblings =
    heirs.fatherAlive &&
    heirs.motherAlive &&
    heirs.sons === 0 &&
    heirs.daughters <= 1;

  const Stepper = ({
    label,
    name,
    value
  }: {
    label: string;
    name: string;
    value: number;
  }) => (
    <div className="flex justify-between items-center py-1.25">
      <span className={labelStyle}>{label}</span>
      <div className="flex items-center gap-2">
        <button
          className={stepperBtnStyle}
          onClick={() => updateCount(name, -1)}
          aria-label="decrease"
        >
          −
        </button>
        <span className="min-w-6 text-center text-[15px] font-medium text-[#1e293b]">
          {value}
        </span>
        <button
          className={stepperBtnStyle}
          onClick={() => updateCount(name, 1)}
          aria-label="increase"
        >
          +
        </button>
      </div>
    </div>
  );

  const DistributionRow = ({
    label,
    share
  }: {
    label: string;
    share: number;
  }) => (
    <tr className={`border-t-[0.5px] border-[#f1f5f9]`}>
      <td className="py-1.5 px-2 text-[#475569]">{label}</td>
      <td className="py-1.5 px-2 text-right font-medium">{share}</td>
    </tr>
  );

  const Checkbox = ({
    label,
    name,
    state
  }: {
    label: String;
    name: string;
    state: boolean;
  }) => (
    <div className="flex justify-between items-center py-1.25">
      <span className={labelStyle}>{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={state}
        onChange={handleChange}
        className={checkboxStyle}
      />
    </div>
  );

  const handleClear = () => {
    if (activeGroup === 'first') {
      setHeirs({
        fatherAlive: false,
        motherAlive: false,
        hasSC: false,
        wives: 0,
        husband: false,
        deceasedIsMale: true,
        sons: 0,
        daughters: 0
      });
    } else {
      setSecondHeirs({
        deceasedIsFemale: false,
        wives: 0,
        hasHusband: false,
        fullBrothers: 0,
        fullSisters: 0,
        paternalBrothers: 0,
        paternalSisters: 0,
        maternalBrothers: 0,
        maternalSisters: 0,
        paternalGrandpa: false,
        paternalGrandma: false,
        maternalGrandpa: false,
        maternalGrandma: false
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen mx-auto p-[10px_12px] box-border bg-[#f8fafc] items-center font-sans">
      <div className="w-full max-w-105 relative">
        <div className="sticky top-0 bg-[#f8fafc] py-2.5 w-full">
          <button
            onClick={handleClear}
            className="absolute top-1 right-1 bg-none border-none text-[#64748b] text-[14px] font-medium cursor-pointer h-[80%] rounded-md bg-[#f1f5f9]"
          >
            Clear
          </button>
          {/* Header */}
          <header className="text-center mb-2.5">
            <h3 className="m-0 text-[20px] font-bold text-[#0f172a]">
              Inheritance calculator
            </h3>
            <p className="m-[2px_0_0] text-[18px] text-[#64748b]">
              Islamic estate distribution
            </p>
          </header>
        </div>
        {/* Group Selector Button Block */}
        <div className={`${cardStyle} flex gap-1.5`}>
          <button
            onClick={() => setActiveGroup('first')}
            className={
              activeGroup === 'first' ? tabActiveStyle : tabInactiveStyle
            }
          >
            First Group
          </button>
          <button
            onClick={() => setActiveGroup('second')}
            className={
              activeGroup === 'second' ? tabActiveStyle : tabInactiveStyle
            }
          >
            Second Group
          </button>
        </div>
        {/* Gender / Spouse Card */}
        <div className={cardStyle}>
          <div className="flex gap-1.5 mb-2.5">
            <button
              onClick={() => {
                setHeirs({ ...heirs, deceasedIsMale: true, husband: false });
                setSecondHeirs({
                  ...secondHeirs,
                  deceasedIsFemale: false,
                  hasHusband: false
                });
              }}
              className={
                heirs.deceasedIsMale ? tabActiveStyle : tabInactiveStyle
              }
            >
              Male deceased
            </button>
            <button
              onClick={() => {
                setHeirs({ ...heirs, deceasedIsMale: false, wives: 0 });
                setSecondHeirs({
                  ...secondHeirs,
                  deceasedIsFemale: true,
                  wives: 0
                });
              }}
              className={
                !heirs.deceasedIsMale ? tabActiveStyle : tabInactiveStyle
              }
            >
              Female deceased
            </button>
          </div>

          <div className={`pt-0.5 ${dividerStyle}`}>
            {heirs.deceasedIsMale ? (
              <Stepper
                label="Wives"
                name="wives"
                value={
                  activeGroup === 'first' ? heirs.wives : secondHeirs.wives
                }
              />
            ) : (
              <div className="flex justify-between items-center py-1.25">
                <span className={labelStyle}>Husband</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    name="husband"
                    className={checkboxStyle}
                    checked={
                      activeGroup === 'first'
                        ? heirs.husband
                        : secondHeirs.hasHusband
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Parents Card */}
        {activeGroup === 'first' && (
          <>
            <div className={cardStyle}>
              <div className="flex justify-between items-center py-1.25">
                <span className={labelStyle}>Parents alive</span>
                <div className="flex items-center gap-3">
                  {showSiblings && (
                    <label className="flex items-center gap-1.25 text-[13px] text-[#dc2626] cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasSC"
                        className="w-6 h-6 accent-[#dc2626]"
                        checked={heirs.hasSC}
                        onChange={handleChange}
                      />
                      Siblings
                    </label>
                  )}
                  <label className="flex items-center gap-1.25 text-[13px] text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      name="fatherAlive"
                      className={checkboxStyle}
                      checked={heirs.fatherAlive}
                      onChange={handleChange}
                    />
                    Father
                  </label>
                  <label className="flex items-center gap-1.25 text-[13px] text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      name="motherAlive"
                      className={checkboxStyle}
                      checked={heirs.motherAlive}
                      onChange={handleChange}
                    />
                    Mother
                  </label>
                </div>
              </div>
            </div>

            {/* Children Card */}
            <div className={cardStyle}>
              <Stepper label="Sons" name="sons" value={heirs.sons} />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Stepper
                label="Daughters"
                name="daughters"
                value={heirs.daughters}
              />
            </div>
          </>
        )}
        {/* Second Group Input Configuration Panels */}
        {activeGroup === 'second' && (
          <>
            {/* Siblings Panel */}
            <div className={cardStyle}>
              <Stepper
                label="Full Brothers"
                name="fullBrothers"
                value={secondHeirs.fullBrothers}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Stepper
                label="Full Sisters"
                name="fullSisters"
                value={secondHeirs.fullSisters}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Stepper
                label="Paternal Brothers"
                name="paternalBrothers"
                value={secondHeirs.paternalBrothers}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Stepper
                label="Paternal Sisters"
                name="paternalSisters"
                value={secondHeirs.paternalSisters}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Stepper
                label="Maternal Brothers"
                name="maternalBrothers"
                value={secondHeirs.maternalBrothers}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Stepper
                label="Maternal Sisters"
                name="maternalSisters"
                value={secondHeirs.maternalSisters}
              />
            </div>

            {/* Grandparents Panel */}
            <div className={cardStyle}>
              <Checkbox
                label={'Paternal Grandpa'}
                name="paternalGrandpa"
                state={secondHeirs.paternalGrandpa}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Checkbox
                label={'Paternal Grandma'}
                name="paternalGrandma"
                state={secondHeirs.paternalGrandma}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Checkbox
                label={'Maternal Grandpa'}
                name="maternalGrandpa"
                state={secondHeirs.maternalGrandpa}
              />
              <div className={`my-0.5 ${dividerStyle}`} />
              <Checkbox
                label={'Maternal Grandma'}
                name="maternalGrandma"
                state={secondHeirs.maternalGrandma}
              />
            </div>
          </>
        )}
        {/* Results */}
        <div className="rounded-xl overflow-hidden border-[0.5px] border-[#e2e8f0]">
          <div className="py-2 px-3.5 bg-[#1e293b] flex justify-between items-center">
            <span className="text-[13px] font-medium uppercase tracking-wider text-white">
              Distribution shares
            </span>
            <label className="flex items-center gap-1.5 text-[12px] text-[#cbd5e1] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSummary}
                onChange={(e) => setShowSummary(e.target.checked)}
                className="accent-[#2563eb]"
              />
              Summary
            </label>
          </div>
          <table className="w-full border-collapse text-[16px]">
            <tbody>
              {activeGroup === 'first' ? (
                <>
                  {heirs.fatherAlive && (
                    <DistributionRow label={'Father'} share={firstRes.father} />
                  )}
                  {heirs.motherAlive && (
                    <DistributionRow label={'Mother'} share={firstRes.mother} />
                  )}
                  {heirs.husband && (
                    <DistributionRow
                      label={'Husband'}
                      share={firstRes.husband}
                    />
                  )}
                  {heirs.wives > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label={`Wife (each)`}
                        share={firstRes.wife}
                      />
                    ) : (
                      Array.from({ length: heirs.wives }, (_, index) => (
                        <DistributionRow
                          key={index}
                          label={`Wife ${index + 1}`}
                          share={firstRes.wife}
                        />
                      ))
                    ))}
                  {heirs.sons > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label={`Son (each)`}
                        share={firstRes.son}
                      />
                    ) : (
                      Array.from({ length: heirs.sons }, (_, index) => (
                        <DistributionRow
                          key={index}
                          label={`Son ${index + 1}`}
                          share={firstRes.son}
                        />
                      ))
                    ))}
                  {heirs.daughters > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label={`Daughter (each)`}
                        share={firstRes.daughter}
                      />
                    ) : (
                      Array.from({ length: heirs.daughters }, (_, index) => (
                        <DistributionRow
                          key={index}
                          label={`Daughter ${index + 1}`}
                          share={firstRes.daughter}
                        />
                      ))
                    ))}
                  {firstRes.settlement > 0 && (
                    <DistributionRow
                      label={'Musalahah'}
                      share={firstRes.settlement}
                    />
                  )}
                  <tr>
                    <td colSpan={2} className="border-t border-black py-1" />
                  </tr>
                  <DistributionRow label={'Total'} share={firstRes.total} />
                </>
              ) : (
                <>
                  {secondHeirs.hasHusband && (
                    <DistributionRow
                      label={'Husband'}
                      share={secondRes.husband}
                    />
                  )}
                  {secondHeirs.wives > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label={`Wife (each)`}
                        share={secondRes.wife}
                      />
                    ) : (
                      Array.from({ length: secondHeirs.wives }, (_, i) => (
                        <DistributionRow
                          key={i}
                          label={`Wife ${i + 1}`}
                          share={secondRes.wife}
                        />
                      ))
                    ))}
                  {secondHeirs.fullBrothers > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label="Full Brother (each)"
                        share={secondRes.fullBrother}
                      />
                    ) : (
                      Array.from(
                        { length: secondHeirs.fullBrothers },
                        (_, i) => (
                          <DistributionRow
                            key={i}
                            label={`Full Brother ${i + 1}`}
                            share={secondRes.fullBrother}
                          />
                        )
                      )
                    ))}
                  {secondHeirs.fullSisters > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label="Full Sister (each)"
                        share={secondRes.fullSister}
                      />
                    ) : (
                      Array.from(
                        { length: secondHeirs.fullSisters },
                        (_, i) => (
                          <DistributionRow
                            key={i}
                            label={`Full Sister ${i + 1}`}
                            share={secondRes.fullSister}
                          />
                        )
                      )
                    ))}
                  {secondHeirs.paternalBrothers > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label="Paternal Brother (each)"
                        share={secondRes.paternalBrother}
                      />
                    ) : (
                      Array.from(
                        { length: secondHeirs.paternalBrothers },
                        (_, i) => (
                          <DistributionRow
                            key={i}
                            label={`Paternal Brother ${i + 1}`}
                            share={secondRes.paternalBrother}
                          />
                        )
                      )
                    ))}
                  {secondHeirs.paternalSisters > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label="Paternal Sister (each)"
                        share={secondRes.paternalSister}
                      />
                    ) : (
                      Array.from(
                        { length: secondHeirs.paternalSisters },
                        (_, i) => (
                          <DistributionRow
                            key={i}
                            label={`Paternal Sister ${i + 1}`}
                            share={secondRes.paternalSister}
                          />
                        )
                      )
                    ))}
                  {secondHeirs.maternalBrothers > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label="Maternal Brother (each)"
                        share={secondRes.maternalBrother}
                      />
                    ) : (
                      Array.from(
                        { length: secondHeirs.maternalBrothers },
                        (_, i) => (
                          <DistributionRow
                            key={i}
                            label={`Maternal Brother ${i + 1}`}
                            share={secondRes.maternalBrother}
                          />
                        )
                      )
                    ))}
                  {secondHeirs.maternalSisters > 0 &&
                    (showSummary ? (
                      <DistributionRow
                        label="Maternal Sister (each)"
                        share={secondRes.maternalSister}
                      />
                    ) : (
                      Array.from(
                        { length: secondHeirs.maternalSisters },
                        (_, i) => (
                          <DistributionRow
                            key={i}
                            label={`Maternal Sister ${i + 1}`}
                            share={secondRes.maternalSister}
                          />
                        )
                      )
                    ))}
                  {secondHeirs.paternalGrandpa && (
                    <DistributionRow
                      label="Paternal Grandpa"
                      share={secondRes.paternalGrandpa}
                    />
                  )}
                  {secondHeirs.paternalGrandma && (
                    <DistributionRow
                      label="Paternal Grandma"
                      share={secondRes.paternalGrandma}
                    />
                  )}
                  {secondHeirs.maternalGrandpa && (
                    <DistributionRow
                      label="Maternal Grandpa"
                      share={secondRes.maternalGrandpa}
                    />
                  )}
                  {secondHeirs.maternalGrandma && (
                    <DistributionRow
                      label="Maternal Grandma"
                      share={secondRes.maternalGrandma}
                    />
                  )}
                  {secondRes.settlement > 0 && (
                    <DistributionRow
                      label="Musalahah"
                      share={secondRes.settlement}
                    />
                  )}
                  <tr>
                    <td colSpan={2} className="border-t border-black py-1" />
                  </tr>
                  <DistributionRow label="Total" share={secondRes.total} />
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* visualisation */}
        <button
          onClick={() => setShowGraph((v) => !v)}
          className="mt-2 w-full rounded-xl bg-[#2563eb] py-2.5 text-[15px] font-semibold tracking-wider text-white"
        >
          {showGraph ? 'HIDE' : 'VISUALIZE'}
        </button>
        {showGraph && (
          <InheritanceGraph
            group={activeGroup}
            first={heirs}
            second={secondHeirs}
            shares={
              activeGroup === 'first' ? { ...firstRes } : { ...secondRes }
            }
          />
        )}
      </div>
    </div>
  );
};

export default InheritanceCalculator;
