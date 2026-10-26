import {
  BaseEdge,
  getSmoothStepPath,
  useInternalNode,
  type EdgeProps
} from '@xyflow/react';
import { getEdgeEndpoints } from './floatingUtils';

export default function FloatingEdge({
  id,
  source,
  target,
  style,
  markerEnd
}: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;

  const { sx, sy, sourcePosition, tx, ty, targetPosition } = getEdgeEndpoints(
    sourceNode,
    targetNode
  );

  const [path] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetX: tx,
    targetY: ty,
    targetPosition,
    borderRadius: 16
  });

  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}
