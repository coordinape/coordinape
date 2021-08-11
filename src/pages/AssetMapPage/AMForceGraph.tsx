import React, { useRef, useEffect, useCallback, useMemo } from 'react';

// import { forceLink, forceCenter } from 'd3-force-3d';
import cloneDeep from 'lodash/cloneDeep';
import ForceGraph2D, { NodeObject, LinkObject } from 'react-force-graph-2d';
import AutoSizer from 'react-virtualized-auto-sizer';

import { makeStyles } from '@material-ui/core';

import {
  useMapGraphData,
  useMapContext,
  useSetAmEgoAddress,
  AmContextDefault,
} from 'recoilState';
import { AVATAR_PLACEHOLDER, getAvatarPath } from 'utils/domain';

import { IMapContext, IMapNodeFG, IMapEdgeFG } from 'types';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  },
  autoSizer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

const COLOR_NODE_HIGHLIGHT = '#13a2cc';
const COLOR_NODE_MORE_HIGHLIGHT = '#44cccc';
const COLOR_GIVE = '#00ce2c';
const COLOR_RECEIVE = '#d3860d';
const COLOR_CIRCULATE = '#c9b508';
const COLOR_NODE = '#000000';
const COLOR_NODE_FADE = '#00000020';
const COLOR_GIVE_LINK = '#00ce2c80';
const COLOR_RECEIVE_LINK = '#d3860d80';
const COLOR_LINK = '#00000015';
const COLOR_LINK_DIM = '#00000008';

const NODE_R = 5;

const edgeWidthScaler = (f: number) => f * 25 + 1;
// const nodeSizeScaler = (f: number) => NODE_R + f * 8;
const nodeBorderScaler = (f: number) => 0.7 + f * 2.5;
// const edgeForceScaler = (f: number) => 0.1 * f;
// const linkStrengthToken = (edge: any) => 0.05 / link.tokens;
// const linkStrengthCounts = (edge: any) => 0.5 / (link.source.linkCount + link.target.linkCount);

export const AMForceGraph = () => {
  const classes = useStyles();
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
    if (!images.current.has(AVATAR_PLACEHOLDER)) {
      const fallbackAvatar = new Image();
      fallbackAvatar.src = AVATAR_PLACEHOLDER;
      images.current.set('', fallbackAvatar);
    }
    recoilMapGraphData.nodes.forEach((node) => {
      const path = (node as IMapNodeFG).img;
      if (path && !images.current.has(path)) {
        const img = new Image();
        img.src = getAvatarPath(path);
        images.current.set(path, img);
      }
    });
  }, [recoilMapGraphData]);

  const linkColor = useCallback((edge: IMapEdgeFG) => {
    const { egoAddress, isEgoEdge } = mapCtxRef.current;

    let color = COLOR_LINK;
    if (egoAddress) {
      color = COLOR_LINK_DIM;
      if (isEgoEdge(edge, 'gives')) {
        return COLOR_RECEIVE_LINK;
      }
      if (isEgoEdge(edge, 'receives')) {
        return COLOR_GIVE_LINK;
      }
    }
    return color;
  }, []);

  const linkDirectionalParticleWidth = useCallback((edge: IMapEdgeFG) => {
    const { getEdgeMeasure, isEgoEdge } = mapCtxRef.current;
    if (isEgoEdge(edge, 'gives') || isEgoEdge(edge, 'receives')) {
      return getEdgeMeasure(edge, edgeWidthScaler);
    }
    return 0;
  }, []);

  const getWidth = useCallback((edge: IMapEdgeFG) => {
    const { getEdgeMeasure } = mapCtxRef.current;
    return getEdgeMeasure(edge, edgeWidthScaler);
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
    return epochId === -1 || node.epochIds.some((id) => id === epochId);
  }, []);

  const nodeCanvasObject = useCallback(
    (node: IMapNodeFG, canvas: CanvasRenderingContext2D) => {
      const {
        getNodeMeasure,
        isEgoNeighbor,
        bag,
        egoAddress,
      } = mapCtxRef.current;
      const nid = node.id;

      const radius = 5;
      const width = getNodeMeasure(node, nodeBorderScaler);
      const isInBag = bag.has(nid);

      let strokeColor = bag.size || egoAddress ? COLOR_NODE_FADE : COLOR_NODE;
      if (isInBag) strokeColor = COLOR_NODE_HIGHLIGHT;
      if (nid === egoAddress) strokeColor = COLOR_NODE_HIGHLIGHT;
      if (bag.size && nid === egoAddress)
        strokeColor = COLOR_NODE_MORE_HIGHLIGHT;
      if (egoAddress) {
        const inNode = isEgoNeighbor(node, 'gives');
        const outNode = isEgoNeighbor(node, 'receives');
        if (inNode) strokeColor = COLOR_GIVE;
        if (outNode) strokeColor = COLOR_RECEIVE;
        if (inNode && outNode) strokeColor = COLOR_CIRCULATE;
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
      canvas.fillStyle = COLOR_NODE;
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
    []
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
    <div className={classes.root}>
      <AutoSizer className={classes.autoSizer}>
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
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default AMForceGraph;
