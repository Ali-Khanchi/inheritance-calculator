import React, { useState, ChangeEvent } from 'react';
import {
  calculateFirstGroupInheritance,
  FirstHeirsState
} from './util/first-group-calculation';
import {
  calculateSecondGroupInheritance,
  SecondHeirsState
} from './util/second-group-calculation';

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
  const [activeGroup, setActiveGroup] = useState<'first' | 'second'>('first');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const targetValue =
      type === 'checkbox' ? checked : Math.max(0, parseInt(value) || 0);

    if (activeGroup === 'first') {
      setHeirs((prev) => ({ ...prev, [name]: targetValue }));
    } else {
      // Maps the 'husband' checkbox target safely to the alternative key signature
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

  // --- STYLES ---

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
    margin: '0 auto',
    padding: '10px 12px',
    boxSizing: 'border-box',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    alignItems: 'center'
  };

  const innerWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '420px',
    position: 'relative' // Added to anchor the absolute positioned button
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    padding: '10px 14px',
    borderRadius: '12px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    border: '0.5px solid #e2e8f0'
  };

  const btnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    fontSize: '18px',
    backgroundColor: '#f1f5f9',
    border: '0.5px solid #cbd5e1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    lineHeight: 1
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0'
  };

  const rowDividerStyle: React.CSSProperties = {
    borderTop: '0.5px solid #f1f5f9'
  };

  const stickyHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8fafc', // Matches containerStyle background to hide scrolling content
    paddingTop: '10px',
    paddingBottom: '10px',
    zIndex: 10,
    width: '100%'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#334155',
    fontWeight: 500
  };

  const Stepper = ({
    label,
    name,
    value
  }: {
    label: string;
    name: string;
    value: number;
  }) => (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          style={btnStyle}
          onClick={() => updateCount(name, -1)}
          aria-label="decrease"
        >
          −
        </button>
        <span
          style={{
            minWidth: '24px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500,
            color: '#1e293b'
          }}
        >
          {value}
        </span>
        <button
          style={btnStyle}
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
    <tr style={{ borderTop: '0.5px solid #f1f5f9' }}>
      <td style={{ padding: '6px 8px', color: '#475569' }}>{label}</td>
      <td
        style={{
          padding: '6px 8px',
          textAlign: 'right',
          fontWeight: 500
        }}
      >
        {share}
      </td>
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
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={state}
        onChange={handleChange}
        style={{
          width: '24px',
          height: '24px',
          accentColor: '#2563eb'
        }}
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
    <div style={containerStyle}>
      <div style={innerWrapperStyle}>
        <div style={stickyHeaderStyle}>
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              // padding: '4px 8px',
              height: '80%',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9'
            }}
          >
            Clear
          </button>
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h3
              style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Inheritance calculator
            </h3>
            <p
              style={{ margin: '2px 0 0', fontSize: '18px', color: '#64748b' }}
            >
              Islamic estate distribution
            </p>
          </header>
        </div>

        {/* Group Selector Button Block */}
        <div
          style={{
            ...cardStyle,
            display: 'flex',
            gap: '6px',
            marginBottom: '8px'
          }}
        >
          <button
            onClick={() => setActiveGroup('first')}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border:
                activeGroup === 'first'
                  ? '1.5px solid #2563eb'
                  : '0.5px solid #e2e8f0',
              backgroundColor: activeGroup === 'first' ? '#eff6ff' : '#fff',
              color: activeGroup === 'first' ? '#1d4ed8' : '#64748b',
              fontWeight: 500,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            First Group
          </button>
          <button
            onClick={() => setActiveGroup('second')}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border:
                activeGroup === 'second'
                  ? '1.5px solid #2563eb'
                  : '0.5px solid #e2e8f0',
              backgroundColor: activeGroup === 'second' ? '#eff6ff' : '#fff',
              color: activeGroup === 'second' ? '#1d4ed8' : '#64748b',
              fontWeight: 500,
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Second Group
          </button>
        </div>

        {/* Gender / Spouse Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <button
              onClick={() => {
                setHeirs({ ...heirs, deceasedIsMale: true, husband: false });
                setSecondHeirs({
                  ...secondHeirs,
                  deceasedIsFemale: false,
                  hasHusband: false
                });
              }}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: heirs.deceasedIsMale
                  ? '1.5px solid #2563eb'
                  : '0.5px solid #e2e8f0',
                backgroundColor: heirs.deceasedIsMale ? '#eff6ff' : '#fff',
                color: heirs.deceasedIsMale ? '#1d4ed8' : '#64748b',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer'
              }}
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
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: !heirs.deceasedIsMale
                  ? '1.5px solid #2563eb'
                  : '0.5px solid #e2e8f0',
                backgroundColor: !heirs.deceasedIsMale ? '#eff6ff' : '#fff',
                color: !heirs.deceasedIsMale ? '#1d4ed8' : '#64748b',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Female deceased
            </button>
          </div>

          <div style={{ borderTop: '0.5px solid #f1f5f9', paddingTop: '2px' }}>
            {heirs.deceasedIsMale ? (
              <Stepper
                label="Wives"
                name="wives"
                value={
                  activeGroup === 'first' ? heirs.wives : secondHeirs.wives
                }
              />
            ) : (
              <div style={rowStyle}>
                <span style={labelStyle}>Husband</span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <input
                    type="checkbox"
                    name="husband"
                    style={{
                      width: '24px',
                      height: '24px',
                      accentColor: '#2563eb'
                    }}
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
            <div style={cardStyle}>
              <div style={{ ...rowStyle }}>
                <span style={labelStyle}>Parents alive</span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  {showSiblings && (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        color: '#dc2626',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        name="hasSC"
                        style={{
                          width: '24px',
                          height: '24px',
                          accentColor: '#dc2626'
                        }}
                        checked={heirs.hasSC}
                        onChange={handleChange}
                      />
                      Siblings
                    </label>
                  )}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '13px',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      name="fatherAlive"
                      style={{
                        width: '24px',
                        height: '24px',
                        accentColor: '#2563eb'
                      }}
                      checked={heirs.fatherAlive}
                      onChange={handleChange}
                    />
                    Father
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '13px',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      name="motherAlive"
                      style={{
                        width: '24px',
                        height: '24px',
                        accentColor: '#2563eb'
                      }}
                      checked={heirs.motherAlive}
                      onChange={handleChange}
                    />
                    Mother
                  </label>
                </div>
              </div>
            </div>

            {/* Children Card */}
            <div style={cardStyle}>
              <Stepper label="Sons" name="sons" value={heirs.sons} />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
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
            <div style={cardStyle}>
              <Stepper
                label="Full Brothers"
                name="fullBrothers"
                value={secondHeirs.fullBrothers}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Stepper
                label="Full Sisters"
                name="fullSisters"
                value={secondHeirs.fullSisters}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Stepper
                label="Paternal Brothers"
                name="paternalBrothers"
                value={secondHeirs.paternalBrothers}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Stepper
                label="Paternal Sisters"
                name="paternalSisters"
                value={secondHeirs.paternalSisters}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Stepper
                label="Maternal Brothers"
                name="maternalBrothers"
                value={secondHeirs.maternalBrothers}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Stepper
                label="Maternal Sisters"
                name="maternalSisters"
                value={secondHeirs.maternalSisters}
              />
            </div>

            {/* Grandparents Panel */}
            <div style={cardStyle}>
              <Checkbox
                label={'Paternal Grandpa'}
                name="paternalGrandpa"
                state={secondHeirs.paternalGrandpa}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Checkbox
                label={'Paternal Grandma'}
                name="paternalGrandma"
                state={secondHeirs.paternalGrandma}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Checkbox
                label={'Maternal Grandpa'}
                name="maternalGrandpa"
                state={secondHeirs.maternalGrandpa}
              />
              <div style={{ ...rowDividerStyle, margin: '2px 0' }} />
              <Checkbox
                label={'Maternal Grandma'}
                name="maternalGrandma"
                state={secondHeirs.maternalGrandma}
              />
            </div>
          </>
        )}

        {/* Results */}
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '0.5px solid #e2e8f0'
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: '#1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#fff'
              }}
            >
              Distribution shares
            </span>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#cbd5e1',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                checked={showSummary}
                onChange={(e) => setShowSummary(e.target.checked)}
                style={{ accentColor: '#2563eb' }}
              />
              Summary
            </label>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '16px'
            }}
          >
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
                    <td
                      colSpan={2}
                      style={{ borderTop: '1px solid black', padding: '4px 0' }}
                    />
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
                    <td
                      colSpan={2}
                      style={{ borderTop: '1px solid black', padding: '4px 0' }}
                    />
                  </tr>
                  <DistributionRow label="Total" share={secondRes.total} />
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InheritanceCalculator;
