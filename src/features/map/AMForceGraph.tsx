import React, { useRef, useEffect, useCallback, useMemo } from 'react';

// import { forceLink, forceCenter } from 'd3-force-3d';
import { StitchesTheme } from 'features/theming/ThemeProvider';
import cloneDeep from 'lodash/cloneDeep';
import ForceGraph2D, { NodeObject, LinkObject } from 'react-force-graph-2d';
import AutoSizer from 'react-virtualized-auto-sizer';
import { styled } from 'stitches.config';

import { Box } from 'ui';

import {
  useMapGraphData,
  useMapContext,
  useSetAmEgoAddress,
  AmContextDefault,
} from './state';

import { IMapContext, IMapNodeFG, IMapEdgeFG } from 'types';

const StyledAutoSizer = styled(AutoSizer, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const MIN_ZOOM = 3;

const NODE_R = 5;
// const nodeSizeScaler = (f: number) => NODE_R + f * 8;
const nodeBorderScaler = (f: number) => 0.7 + f * 2.5;
// const edgeForceScaler = (f: number) => 0.1 * f;
// const linkStrengthToken = (edge: any) => 0.05 / link.tokens;
// const linkStrengthCounts = (edge: any) => 0.5 / (link.source.linkCount + link.target.linkCount);

export const AMForceGraph = ({
  stitchesTheme,
}: {
  stitchesTheme: StitchesTheme;
}) => {
  const fgRef = useRef<any>(null);
  const recoilMapGraphData = useMapGraphData();
  const mapContext = useMapContext();
  const setAmEgoAddress = useSetAmEgoAddress();

  // Use a context so that the ForceGraph2D doesn't need to rerender.
  const mapCtxRef = useRef<IMapContext>(AmContextDefault);
  const images = useRef<Map<string, HTMLImageElement>>(new Map());

  const mapGraphData = useMemo(() => {
    // Recoil state isn't mutable, so make a copy
    return cloneDeep(recoilMapGraphData);
  }, [recoilMapGraphData]);

  useEffect(() => {
    if (mapContext.state === 'hasValue') {
      const ctx = mapContext.contents;
      mapCtxRef.current = ctx;
      if (!fgRef.current) {
        return;
      }
      // TODO: Improve the layout forces
      // fgRef.current.d3Force(
      //   'link',
      //   forceLink().strength(
      //     (edge: IMapEdgeFG) =>
      //       (100 / (ctx.measures.count || 1)) *
      //       ctx.getEdgeMeasure(edge, edgeForceScaler)
      //   )
      // );
      // fgRef.current.d3Force('center', forceCenter().strength(1.4));
    }
  }, [mapContext]);

  useEffect(() => {
    // These can't be stored in recoil because:
    // Type 'HTMLImageElement' does not satisfy the constraint 'SerializableParam'.
    recoilMapGraphData.nodes.forEach(node => {
      const path = (node as IMapNodeFG).img;
      if (path && !images.current.has(path)) {
        const img = new Image();
        img.src = path;
        images.current.set(path, img);
      }
    });
  }, [recoilMapGraphData]);

  const linkColor = useCallback(
    (edge: IMapEdgeFG) => {
      const { egoAddress, isEgoEdge } = mapCtxRef.current;

      let color = stitchesTheme.colors.mapLink.value;
      if (egoAddress) {
        color = stitchesTheme.colors.mapLinkDim.value;
        if (isEgoEdge(edge, 'gives')) {
          return stitchesTheme.colors.mapReceiveLink.value;
        }
        if (isEgoEdge(edge, 'receives')) {
          return stitchesTheme.colors.mapGiveLink.value;
        }
      }
      return color;
    },
    [stitchesTheme]
  );

  const linkDirectionalParticleWidth = useCallback((edge: IMapEdgeFG) => {
    const { getEdgeMeasure, isEgoEdge } = mapCtxRef.current;
    if (isEgoEdge(edge, 'gives') || isEgoEdge(edge, 'receives')) {
      return getEdgeMeasure(edge) * MIN_ZOOM * NODE_R * 2;
    }
    return 0;
  }, []);

  const getWidth = useCallback((edge: IMapEdgeFG) => {
    const { getEdgeMeasure } = mapCtxRef.current;
    return getEdgeMeasure(edge) * MIN_ZOOM * NODE_R * 2;
  }, []);

  const getCurvature = useCallback((edge: IMapEdgeFG) => {
    return mapCtxRef.current.getCurvature(edge);
  }, []);

  const isLinkVisible = useCallback((edge: IMapEdgeFG) => {
    const { epochId } = mapCtxRef.current;
    return epochId === -1 || edge.epochId === epochId;
  }, []);

  const isNodeVisible = useCallback((node: IMapNodeFG) => {
    const { epochId } = mapCtxRef.current;
    return epochId === -1 || node.epochIds.some(id => id === epochId);
  }, []);

  const nodeCanvasObject = useCallback(
    (node: IMapNodeFG, canvas: CanvasRenderingContext2D) => {
      const { getNodeMeasure, isEgoNeighbor, bag, egoAddress } =
        mapCtxRef.current;
      const nid = node.id;

      const radius = NODE_R;
      const width = getNodeMeasure(node, nodeBorderScaler);
      const isInBag = bag.has(nid);

      let strokeColor =
        bag.size || egoAddress
          ? stitchesTheme.colors.mapNodeFade.value
          : stitchesTheme.colors.mapNode.value;
      if (isInBag) strokeColor = stitchesTheme.colors.mapNodeHighlight.value;
      if (nid === egoAddress)
        strokeColor = stitchesTheme.colors.mapNodeHighlight.value;
      if (bag.size && nid === egoAddress)
        strokeColor = stitchesTheme.colors.mapNodeMoreHighlight.value;
      if (egoAddress) {
        const inNode = isEgoNeighbor(node, 'gives');
        const outNode = isEgoNeighbor(node, 'receives');
        if (inNode) strokeColor = stitchesTheme.colors.mapGive.value;
        if (outNode) strokeColor = stitchesTheme.colors.mapReceive.value;
        if (inNode && outNode)
          strokeColor = stitchesTheme.colors.mapCirculate.value;
      }

      canvas.beginPath();
      canvas.arc(node.x, node.y, radius + 0.5 * width, 0, 2 * Math.PI);
      canvas.strokeStyle = strokeColor;
      canvas.lineWidth = width;
      canvas.stroke();
      canvas.closePath();

      canvas.save();
      canvas.beginPath();
      canvas.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      canvas.fillStyle = stitchesTheme.colors.mapNode.value;
      canvas.fill();
      canvas.clip();

      const img = images.current.get(node.img);
      if (img) {
        try {
          canvas.drawImage(
            img,
            node.x - radius,
            node.y - radius,
            radius * 2,
            radius * 2
          );
        } catch (error) {
          // console.error(error);
          // nothing.
        }
      }

      canvas.restore();
    },
    [stitchesTheme]
  );

  const onNodeClick = useCallback((node: IMapNodeFG) => {
    const { egoAddress } = mapCtxRef.current;

    if (egoAddress === node.id) {
      setAmEgoAddress('');
    } else {
      setAmEgoAddress(node.id);
    }
  }, []);

  const onBackgroundClick = useCallback(() => {
    setAmEgoAddress('');
  }, []);

  return (
    <Box
      css={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <StyledAutoSizer>
        {({ height, width }) => (
          <ForceGraph2D
            ref={fgRef}
            graphData={mapGraphData}
            height={height}
            width={width}
            nodeRelSize={NODE_R}
            nodeCanvasObject={nodeCanvasObject as (n: NodeObject) => number}
            onNodeClick={onNodeClick as (n: NodeObject) => void}
            onBackgroundClick={onBackgroundClick}
            onLinkClick={onBackgroundClick}
            nodeVisibility={isNodeVisible as (n: NodeObject) => boolean}
            linkVisibility={isLinkVisible as (l: LinkObject) => boolean}
            linkColor={linkColor as (l: LinkObject) => string}
            linkDirectionalParticleWidth={
              linkDirectionalParticleWidth as (l: LinkObject) => number
            }
            linkWidth={getWidth as (l: LinkObject) => number}
            linkCurvature={getCurvature as (l: LinkObject) => number}
            linkDirectionalParticles={4}
            minZoom={MIN_ZOOM}
          />
        )}
      </StyledAutoSizer>
    </Box>
  );
};

export default AMForceGraph;
