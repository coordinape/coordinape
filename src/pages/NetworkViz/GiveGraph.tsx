import { useCallback, useEffect, useRef, useState } from 'react';

import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { coLinksPaths } from 'routes/paths';
import { Flex } from 'ui';

export function GiveGraph({
  skill,
  height,
  zoom = true,
  compact = false,
}: {
  skill?: string;
  height?: number;
  zoom?: boolean;
  compact?: boolean;
}) {
  const [graphReady, setGraphReady] = useState(false);

  const { data, isLoading, isFetched, refetch } = useQuery(
    ['give-graph', skill ?? 'all-skills'],
    () => {
      return fetchGives(skill);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const imgCache = useRef({});

  const nodeCanvasObject = useCallback(
    (node, ctx) => {
      const size = 14;
      const img = imgCache.current[node.id];
      if (img) {
        // Draw circular clipping path
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#512AC0';
        ctx.fill();
        ctx.strokeStyle = '#512AC0';
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `8px Sans-Serif`;
        ctx.fillText(node.name.slice(0, 2), node.x, node.y);
      }
    },
    [imgCache]
  );

  useEffect(() => {
    if (data && isFetched && !graphReady) {
      setGraphReady(true);
      refetch();
      data.nodes.forEach(node => {
        if (node.avatar && !imgCache.current[node.id]) {
          const img = new Image();
          img.src = node.avatar;
          img.onload = () => {
            imgCache.current[node.id] = img;
          };
          img.onerror = () => {
            imgCache.current[node.id] = null; // Handle broken image
          };
        }
      });
    }
  }, [data, isFetched, setGraphReady]);

  if (!data || isLoading)
    return (
      <>
        <Flex column css={{ width: '100%', mb: '$1xl' }}>
          <LoadingIndicator />
        </Flex>
      </>
    );

  if (graphReady)
    return (
      <ForceGraph2D
        height={height}
        linkCurvature={0.3}
        linkDirectionalParticles={1}
        enableZoomInteraction={zoom}
        linkColor={() => {
          return 'rgba(255, 255, 255, .8)';
        }}
        nodeLabel={n => `${n.name}`}
        onNodeClick={node => {
          window.open(`${coLinksPaths.partyProfile(node.id)}`);
        }}
        nodeCanvasObject={nodeCanvasObject}
        ref={graph => {
          if (graph && compact) {
            graph.d3Force('charge').strength(-5); // Adjust this value to reduce repulsion
            graph.d3Force('link').distance(30); // Adjust link distance if needed
          }
        }}
        graphData={data}
      />
    );
}

const fetchGives = async (skill?: string) => {
  const resp = await fetch('/api/give' + (skill ? `/${skill}` : ''));
  return resp.json();
};
