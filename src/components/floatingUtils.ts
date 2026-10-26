import { Position, type InternalNode } from '@xyflow/react';

function center(node: InternalNode) {
  const w = node.measured.width ?? 0;
  const h = node.measured.height ?? 0;
  const { x, y } = node.internals.positionAbsolute;
  return { cx: x + w / 2, cy: y + h / 2, hw: w / 2, hh: h / 2 };
}

// Where the line from a node's centre towards (tx, ty) crosses its border,
// and which side of the node that crossing is on
function borderPoint(node: InternalNode, tx: number, ty: number) {
  const { cx, cy, hw, hh } = center(node);
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy, side: Position.Bottom };

  const tX = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const tY = dy !== 0 ? hh / Math.abs(dy) : Infinity;

  const side =
    tX <= tY
      ? dx > 0
        ? Position.Right
        : Position.Left
      : dy > 0
        ? Position.Bottom
        : Position.Top;

  // Fork nodes are rounded pills, so their bounding box edge is not visible.
  // Start the line at the centre and let it sit under the node.
  if (node.type === 'fork') {
    return { x: cx, y: cy, side };
  }

  const t = Math.min(tX, tY);
  return { x: cx + dx * t, y: cy + dy * t, side };
}

export function getEdgeEndpoints(source: InternalNode, target: InternalNode) {
  const s = center(source);
  const t = center(target);
  const sp = borderPoint(source, t.cx, t.cy);
  const tp = borderPoint(target, s.cx, s.cy);
  return {
    sx: sp.x,
    sy: sp.y,
    sourcePosition: sp.side,
    tx: tp.x,
    ty: tp.y,
    targetPosition: tp.side
  };
}
