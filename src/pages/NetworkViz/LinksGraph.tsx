import { lazy, useCallback, useEffect, useRef, useState } from 'react';

import { useQuery } from 'react-query';

import { getAvatarPath } from '../../utils/domain';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { coLinksPaths } from 'routes/paths';
import { Flex } from 'ui';

const ForceGraph2D = lazy(() => import('react-force-graph-2d'));

interface IMapNode {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}
type node = {
  id: string;
  name: string;
  avatar: string;
};

type link = {
  source: string;
  target: string;
  amount: string;
};

export function LinksGraph({
  address,
  height,
  zoom = true,
  compact = false,
}: {
  address?: string;
  height?: number;
  zoom?: boolean;
  compact?: boolean;
}) {
  const [graphReady, setGraphReady] = useState(false);

  const { data, isLoading, isFetched, refetch } = useQuery(
    ['link-graph', address ?? 'all-links'],
    () => {
      return fetchLinks(address);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const imgCache = useRef<{ [key: string]: HTMLImageElement | null }>({});

  const showExtras = data?.nodes?.length || 0 < 1000;
  const nodeCanvasObject = useCallback(
    (node: IMapNode, ctx: CanvasRenderingContext2D) => {
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
        ctx.fillText(node.name?.slice(0, 2), node.x, node.y);
      }
    },
    [imgCache]
  );

  useEffect(() => {
    if (data && isFetched && !graphReady) {
      setGraphReady(true);
      refetch();
      if (showExtras) {
        data.nodes.forEach((node: node) => {
          if (node.avatar && !imgCache.current[node.id]) {
            const img = new Image();
            img.src = getAvatarPath(node.avatar) ?? node.avatar;
            img.onload = () => {
              imgCache.current[node.id] = img;
            };
            img.onerror = () => {
              imgCache.current[node.id] = null; // Handle broken image
            };
          }
        });
      }
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
        linkDirectionalParticles={showExtras ? 1 : 0}
        enableZoomInteraction={zoom}
        linkColor={() => {
          return 'rgba(255, 255, 255, .8)';
        }}
        nodeLabel={(n: any) => `${n.name}`}
        onNodeClick={(node: any) => {
          window.open(`${coLinksPaths.profileGive(node.id)}`);
        }}
        {...(showExtras ? { nodeCanvasObject } : {})}
        //@ts-ignore TODO: fix types
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

const fetchLinks = async (address?: string) => {
  const resp = await fetch(
    '/api/links' + (address ? `?address=${address}` : '')
  );
  return resp.json() as Promise<{ nodes: node[]; links: link[] }>;
};
