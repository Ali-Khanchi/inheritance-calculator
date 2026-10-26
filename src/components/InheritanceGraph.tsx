import { useEffect, Fragment, type CSSProperties, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FirstHeirsState } from '../util/first-group-calculation';
import type { SecondHeirsState } from '../util/second-group-calculation';
import FloatingEdge from './FloatingEdge';

/* ----------------------------- Config ----------------------------- */

type Side = 'top' | 'bottom' | 'left' | 'right';
const SIDES: Side[] = ['top', 'bottom', 'left', 'right'];
const POSITION: Record<Side, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right
};
const edgeTypes = { floating: FloatingEdge };

const COLORS = {
  son: '#2563eb',
  daughter: '#ec4899',
  sibling: '#eab308',
  parent: '#16a34a',
  grandparent: '#0d9488',
  spouse: '#dc2626',
  lineage: '#94a3b8',
  deceased: '#1e293b'
};

const NODE_W = 140;
const NODE_H = 60;
const FORK_W = 110;
const FORK_H = 28;
const ROW_GAP = 170; // horizontal spacing for items in a row
const STACK_GAP = 80; // vertical spacing for stacked spouses

// Node centres
const POS = {
  spouseX: -270,
  spouseForkX: -135,
  fatherX: -240,
  motherX: 240,
  parentsY: -200,
  grandparentsY: -380,
  grandForkY: -290,
  forkY: 110,
  rowY: 230
};

const LINEAGE_STYLE: CSSProperties = {
  stroke: COLORS.lineage,
  strokeWidth: 1.5,
  strokeDasharray: '4 4'
};

export type Shares = Record<string, number>;

export interface GraphInput {
  group: 'first' | 'second';
  first: FirstHeirsState;
  second: SecondHeirsState;
  shares: Shares;
}

/* ----------------------------- Types ------------------------------ */

type Variant = 'heir' | 'relative' | 'deceased';

interface Person {
  id: string;
  label: string;
  share?: number;
  pct?: number;
  color: string;
  variant: Variant;
  x: number;
  y: number;
}

interface PersonData extends Record<string, unknown> {
  label: string;
  share?: number;
  pct?: number;
  color: string;
  variant: Variant;
}

interface ForkData extends Record<string, unknown> {
  sum: number;
  pct: number;
  color: string;
}

type AppNode = Node<PersonData, 'person'> | Node<ForkData, 'fork'>;

interface Fan {
  members: Person[];
  color: string;
  fork?: { x: number; y: number }; // only needed when members.length > 1
  forkToMembers: Side; // side of the fork facing its members
  memberSide: Side; // side of each member facing the fork
  trunk: { from: Side; to: string; toSide: Side }; // fork (or lone member) -> inheritance target
  lineage?: { from: Side; to: string; toSide: Side }[]; // dashed family links
}

/* ----------------------------- Helpers ---------------------------- */

const round = (n: number) => Math.round(n * 100) / 100;
const strokeFor = (pct = 0) => Math.min(14, 1.5 + pct / 3);
const solid = (color: string, pct?: number): CSSProperties => ({
  stroke: color,
  strokeWidth: strokeFor(pct)
});

// Centred offset for item i of n
const rowX = (i: number, n: number, gap = ROW_GAP) => (i - (n - 1) / 2) * gap;
const avgX = (ps: Person[]) => ps.reduce((s, p) => s + p.x, 0) / ps.length;
const sumShare = (ps: Person[]) => ps.reduce((s, p) => s + (p.share ?? 0), 0);
const sumPct = (ps: Person[]) => ps.reduce((s, p) => s + (p.pct ?? 0), 0);
const topLeft = (x: number, y: number, w: number, h: number) => ({
  x: x - w / 2,
  y: y - h / 2
});

const make = (
  prefix: string,
  label: string,
  count: number,
  share: number,
  color: string
): Person[] =>
  Array.from(
    { length: count },
    (_, i): Person => ({
      id: `${prefix}-${i}`,
      label: count === 1 ? label : `${label} ${i + 1}`,
      share,
      color,
      variant: 'heir',
      x: 0,
      y: 0
    })
  );

const grandparents = (
  prefix: string,
  parentX: number,
  items: { id: string; label: string; show: boolean; share: number }[]
): Person[] => {
  const shown = items.filter((i) => i.show);
  return shown.map(
    (i, idx): Person => ({
      id: `${prefix}-${i.id}`,
      label: i.label,
      share: i.share,
      color: COLORS.grandparent,
      variant: 'heir',
      x: parentX + rowX(idx, shown.length, 160),
      y: POS.grandparentsY
    })
  );
};

const lineage = (p: Person | null, from: Side): NonNullable<Fan['lineage']> =>
  p ? [{ from, to: p.id, toSide: 'bottom' }] : [];

const makeEdge = (
  source: string,
  target: string,
  style: CSSProperties
): Edge => ({
  id: `${source}->${target}`,
  source,
  target,
  type: 'floating',
  style
});

const personNode = (p: Person): AppNode => ({
  id: p.id,
  type: 'person',
  position: topLeft(p.x, p.y, NODE_W, NODE_H),
  data: {
    label: p.label,
    share: p.share,
    pct: p.pct,
    color: p.color,
    variant: p.variant
  }
});

/**
 * A fan is a group of relatives that all relate to the same target.
 * With 2+ members a fork node is created, which carries the summed
 * share and percentage. The trunk and the member lines are then drawn
 * from the fork, so each group produces one trunk line instead of many.
 */
function addFan(f: Fan, nodes: AppNode[], edges: Edge[]) {
  if (f.members.length === 0) return;

  const groupPct = sumPct(f.members);
  let src: string;

  if (f.members.length > 1 && f.fork) {
    src = `fork-${f.members[0].id}`;
    nodes.push({
      id: src,
      type: 'fork',
      position: topLeft(f.fork.x, f.fork.y, FORK_W, FORK_H),
      data: {
        sum: round(sumShare(f.members)),
        pct: round(groupPct),
        color: f.color
      }
    });
    f.members.forEach((m) =>
      edges.push(makeEdge(src, m.id, solid(m.color, m.pct)))
    );
  } else {
    src = f.members[0].id;
  }

  edges.push(makeEdge(src, f.trunk.to, solid(f.color, groupPct)));

  f.lineage?.forEach((l) => {
    const id = `deceased->${l.to}`;
    if (!edges.some((e) => e.id === id)) {
      edges.push(makeEdge('deceased', l.to, LINEAGE_STYLE));
    }
  });
}

/* --------------------------- Graph builder ------------------------ */

function buildGraph({ group, first, second, shares }: GraphInput) {
  const isFirst = group === 'first';
  const s = second;

  /* Spouses: stacked in a column to the left of the deceased */
  const wives = isFirst ? first.wives : s.wives;
  const hasHusband = isFirst ? first.husband : s.hasHusband;
  const spouses = [
    ...(hasHusband
      ? make('husband', 'Husband', 1, shares.husband, COLORS.spouse)
      : []),
    ...make('wife', 'Wife', wives, shares.wife, COLORS.spouse)
  ];

  spouses.forEach((p, i) => {
    // Row above the deceased, between the parents
    p.x = rowX(i, spouses.length, ROW_GAP);
    p.y = POS.parentsY;
  });

  /* Family counts (second group only) */
  const fullCount = isFirst ? 0 : s.fullBrothers + s.fullSisters;
  const patCount = isFirst ? 0 : s.paternalBrothers + s.paternalSisters;
  const matCount = isFirst ? 0 : s.maternalBrothers + s.maternalSisters;
  const patGrand = !isFirst && (s.paternalGrandpa || s.paternalGrandma);
  const matGrand = !isFirst && (s.maternalGrandpa || s.maternalGrandma);

  /* Parents: inheritors in group 1, deceased-style relatives in group 2.
     In group 2 a parent is drawn as a placeholder when they are needed to
     link siblings or grandparents, even if they are not alive. */
  const showFather =
    first.fatherAlive || fullCount + patCount > 0 || !!patGrand;
  const showMother =
    first.motherAlive || fullCount + matCount > 0 || !!matGrand;

  const fatherPos = { x: -260, y: 0 }; // left of deceased
  const motherPos = { x: 260, y: 0 }; // right of deceased

  const father: Person | null = showFather
    ? {
        id: 'father',
        label: 'Father',
        share: isFirst ? shares.father : undefined,
        color: COLORS.parent,
        variant: isFirst ? 'heir' : 'relative',
        x: fatherPos.x,
        y: fatherPos.y
      }
    : null;

  const mother: Person | null = showMother
    ? {
        id: 'mother',
        label: 'Mother',
        share: isFirst ? shares.mother : undefined,
        color: COLORS.parent,
        variant: isFirst ? 'heir' : 'relative',
        x: motherPos.x,
        y: motherPos.y
      }
    : null;

  /* Grandparents (second group only) */
  const patGP = isFirst
    ? []
    : grandparents('pgp', fatherPos.x, [
        {
          id: 'grandpa',
          label: 'Paternal Grandpa',
          show: s.paternalGrandpa,
          share: shares.paternalGrandpa
        },
        {
          id: 'grandma',
          label: 'Paternal Grandma',
          show: s.paternalGrandma,
          share: shares.paternalGrandma
        }
      ]);
  const matGP = isFirst
    ? []
    : grandparents('mgp', motherPos.x, [
        {
          id: 'grandpa',
          label: 'Maternal Grandpa',
          show: s.maternalGrandpa,
          share: shares.maternalGrandpa
        },
        {
          id: 'grandma',
          label: 'Maternal Grandma',
          show: s.maternalGrandma,
          share: shares.maternalGrandma
        }
      ]);

  /* Children (first group) */
  const sons = isFirst
    ? make('son', 'Son', first.sons, shares.son, COLORS.son)
    : [];
  const daughters = isFirst
    ? make(
        'daughter',
        'Daughter',
        first.daughters,
        shares.daughter,
        COLORS.daughter
      )
    : [];

  /* Siblings (second group): paternal left, full centre, maternal right */
  const patSibs = isFirst
    ? []
    : [
        ...make(
          'pBro',
          'Paternal Brother',
          s.paternalBrothers,
          shares.paternalBrother,
          COLORS.sibling
        ),
        ...make(
          'pSis',
          'Paternal Sister',
          s.paternalSisters,
          shares.paternalSister,
          COLORS.sibling
        )
      ];
  const fullSibs = isFirst
    ? []
    : [
        ...make(
          'fBro',
          'Full Brother',
          s.fullBrothers,
          shares.fullBrother,
          COLORS.sibling
        ),
        ...make(
          'fSis',
          'Full Sister',
          s.fullSisters,
          shares.fullSister,
          COLORS.sibling
        )
      ];
  const matSibs = isFirst
    ? []
    : [
        ...make(
          'mBro',
          'Maternal Brother',
          s.maternalBrothers,
          shares.maternalBrother,
          COLORS.sibling
        ),
        ...make(
          'mSis',
          'Maternal Sister',
          s.maternalSisters,
          shares.maternalSister,
          COLORS.sibling
        )
      ];

  /* One horizontal row below the deceased holds children or siblings */
  const row = isFirst
    ? [...sons, ...daughters]
    : [...patSibs, ...fullSibs, ...matSibs];
  row.forEach((p, i) => {
    p.x = rowX(i, row.length);
    p.y = POS.rowY;
  });

  const sumOf = (ps: Person[]) => ps.reduce((a, p) => a + (p.share ?? 0), 0);

  if (!isFirst) {
    if (father) father.share = sumOf([...patGP, ...patSibs]);
    if (mother) mother.share = sumOf([...matGP, ...matSibs]);
  }

  /* Collect every person and compute percentages against the full total */
  const people: Person[] = [
    ...spouses,
    ...sons,
    ...daughters,
    ...patSibs,
    ...fullSibs,
    ...matSibs,
    ...patGP,
    ...matGP,
    ...(father ? [father] : []),
    ...(mother ? [mother] : [])
  ];

  const total =
    people
      .filter((p) => p.variant === 'heir')
      .reduce((sum, p) => sum + (p.share ?? 0), 0) + (shares.settlement ?? 0);

  people.forEach((p) => {
    p.pct = total > 0 ? ((p.share ?? 0) / total) * 100 : 0;
  });

  const nodes: AppNode[] = [
    {
      id: 'deceased',
      type: 'person',
      position: topLeft(0, 0, NODE_W, NODE_H),
      data: { label: 'Deceased', color: COLORS.deceased, variant: 'deceased' }
    },
    ...people.map(personNode)
  ];

  /* Fans: each group of relatives and its connections */
  const fans: Fan[] = [];

  if (spouses.length) {
    fans.push({
      members: spouses,
      color: COLORS.spouse,
      fork: { x: 0, y: -110 },
      forkToMembers: 'bottom',
      memberSide: 'top',
      trunk: { from: 'bottom', to: 'deceased', toSide: 'top' }
    });
  }

  if (isFirst) {
    const children = [...sons, ...daughters];
    if (children.length)
      fans.push({
        members: children,
        color: COLORS.lineage, // neutral fork colour; members keep their own colour
        fork: { x: avgX(children), y: POS.forkY },
        forkToMembers: 'bottom',
        memberSide: 'top',
        trunk: { from: 'top', to: 'deceased', toSide: 'bottom' }
      });
  } else {
    /* Grandparents hang above the parent they descend through */
    if (father && patGP.length)
      fans.push({
        members: patGP,
        color: COLORS.grandparent,
        fork: { x: POS.fatherX, y: POS.grandForkY },
        forkToMembers: 'top',
        memberSide: 'bottom',
        trunk: { from: 'bottom', to: 'father', toSide: 'top' }
      });
    if (mother && matGP.length)
      fans.push({
        members: matGP,
        color: COLORS.grandparent,
        fork: { x: POS.motherX, y: POS.grandForkY },
        forkToMembers: 'top',
        memberSide: 'bottom',
        trunk: { from: 'bottom', to: 'mother', toSide: 'top' }
      });

    /* Paternal half-siblings: trunk to deceased, dashed link to father */
    if (patSibs.length)
      fans.push({
        members: patSibs,
        color: COLORS.sibling,
        fork: { x: avgX(patSibs), y: POS.forkY },
        forkToMembers: 'bottom',
        memberSide: 'top',
        trunk: {
          from: 'top',
          to: father ? 'father' : 'deceased',
          toSide: 'bottom'
        },
        lineage: []
      });

    /* Full siblings: trunk to deceased, dashed links to both parents */
    if (fullSibs.length)
      fans.push({
        members: fullSibs,
        color: COLORS.sibling,
        fork: { x: avgX(fullSibs), y: POS.forkY },
        forkToMembers: 'bottom',
        memberSide: 'top',
        trunk: { from: 'top', to: 'deceased', toSide: 'bottom' },
        lineage: [...lineage(father, 'left'), ...lineage(mother, 'right')]
      });

    /* Maternal half-siblings: trunk to deceased, dashed link to mother */
    if (matSibs.length)
      fans.push({
        members: matSibs,
        color: COLORS.sibling,
        fork: { x: avgX(matSibs), y: POS.forkY },
        forkToMembers: 'bottom',
        memberSide: 'top',
        trunk: {
          from: 'top',
          to: mother ? 'mother' : 'deceased',
          toSide: 'bottom'
        },
        lineage: []
      });
  }

  const edges: Edge[] = [];
  fans.forEach((f) => addFan(f, nodes, edges));

  [father, mother].forEach((p) => {
    if (!p) return;
    const id = `deceased->${p.id}`;
    if (edges.some((e) => e.id === id)) return;
    edges.push(
      makeEdge(
        'deceased',
        p.id,
        p.variant === 'heir' ? solid(p.color, p.pct) : LINEAGE_STYLE
      )
    );
  });

  return { nodes, edges };
}

/* ----------------------------- Node UI ---------------------------- */

function Handles() {
  return (
    <>
      {SIDES.map((side) => (
        <Fragment key={side}>
          <Handle
            type="target"
            id={`t-${side}`}
            position={POSITION[side]}
            style={{ opacity: 0 }}
          />
          <Handle
            type="source"
            id={`s-${side}`}
            position={POSITION[side]}
            style={{ opacity: 0 }}
          />
        </Fragment>
      ))}
    </>
  );
}

function PersonNode({ data }: NodeProps<Node<PersonData, 'person'>>) {
  const { label, share, pct, color, variant } = data;
  const isDeceased = variant === 'deceased';
  const isRelative = variant === 'relative';

  const style: CSSProperties = isDeceased
    ? {
        background: COLORS.deceased,
        color: '#fff',
        border: '2px solid #0f172a'
      }
    : isRelative
      ? {
          background: '#f8fafc',
          color: '#64748b',
          border: `2px dashed ${color}`,
          opacity: 0.85
        }
      : { background: '#fff', color: '#0f172a', border: `2px solid ${color}` };

  return (
    <div
      style={{ ...style, width: NODE_W }}
      className="rounded-xl px-2 py-1.5 text-center text-[12px] shadow-sm"
    >
      <Handles />
      <div className="font-semibold">{label}</div>
      {share !== undefined && (
        <div className="mt-0.5 text-[13px]">
          <span className="font-bold">{share}</span>{' '}
          <span className="opacity-70">({pct?.toFixed(1)}%)</span>
        </div>
      )}
    </div>
  );
}

function ForkNode({ data }: NodeProps<Node<ForkData, 'fork'>>) {
  return (
    <div
      style={{ width: FORK_W, height: FORK_H, borderColor: data.color }}
      className="flex items-center justify-center rounded-full border-[1.5px] bg-white text-[11px] font-semibold text-[#0f172a] shadow-sm"
    >
      <Handles />Σ {data.sum} · {data.pct.toFixed(1)}%
    </div>
  );
}

const nodeTypes = { person: PersonNode, fork: ForkNode };

/* ----------------------------- Legend ----------------------------- */

const LEGEND: [string, string][] = [
  ['Son', COLORS.son],
  ['Daughter', COLORS.daughter],
  ['Sibling', COLORS.sibling],
  ['Parent', COLORS.parent],
  ['Grandparent', COLORS.grandparent],
  ['Spouse', COLORS.spouse]
];

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-[#e2e8f0] px-4 py-2 text-[12px] text-[#475569]">
      {LEGEND.map(([label, color]) => (
        <span key={label} className="flex items-center gap-1">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
          />
          {label}
        </span>
      ))}
      <span className="text-[#94a3b8]">
        Line width = share · dashed = family link · Σ = group sum of share and %
      </span>
    </div>
  );
}

/* ----------------------------- Component -------------------------- */

export default function InheritanceGraph(props: GraphInput) {
  const graphKey = JSON.stringify(props);
  const initial = buildGraph(props);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(
    initial.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initial.edges);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Rebuild the layout when the inputs change. Dragged positions are
  // kept until the inputs change.
  useEffect(() => {
    const g = buildGraph(props);
    setNodes(g.nodes);
    setEdges(g.edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphKey]);

  const resetLayout = () => {
    const g = buildGraph(props);
    setNodes(g.nodes);
    setEdges(g.edges);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative left-1/2 mt-2 w-screen -translate-x-1/2 overflow-hidden border-y border-[#e2e8f0] bg-white"
    >
      <div className="flex items-center justify-end border-b border-[#e2e8f0] px-3 py-1.5">
        <button
          onClick={resetLayout}
          className="rounded-md bg-[#f1f5f9] px-3 py-1 text-[13px] font-medium text-[#475569]"
        >
          Reset layout
        </button>
      </div>
      <div className="h-[70vh] min-h-120 w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable
          nodesConnectable={false}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <Legend />
    </div>
  );
}
