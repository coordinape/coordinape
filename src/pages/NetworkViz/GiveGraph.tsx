import { useCallback, useEffect, useRef, useState, lazy } from 'react';

import { NodeObject } from 'react-force-graph-2d';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { PartyProfileContent } from 'pages/GiveParty/PartyProfileContent';
import { coLinksPaths } from 'routes/paths';
import { Flex, Modal } from 'ui';

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
  skill: string;
};

export function GiveGraph({
  address,
  skill,
  height,
  width,
  zoom = true,
  compact = false,
}: {
  address?: string;
  skill?: string;
  height?: number;
  width?: number;
  zoom?: boolean;
  compact?: boolean;
}) {
  const [graphReady, setGraphReady] = useState(false);
  const onClose = () => setVisible(prev => !prev);
  const [visible, setVisible] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const { data, isLoading, isFetched, refetch } = useQuery(
    ['give-graph', skill ?? address ?? 'all-skills'],
    () => {
      if (address) {
        return fetchGivesForProfile(address);
      }
      return fetchGives(skill);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const imgCache = useRef<{ [key: string]: HTMLImageElement | null }>({});

  const showExtras = (data?.nodes?.length || 0) < 1000;
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
        ctx.fillText(node.name.slice(0, 2), node.x, node.y);
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
    }
    // eslint-disable-next-line no-console
    console.log('forcegraph data:', data);
  }, [data, isFetched, setGraphReady]);

  if (!data || isLoading || !graphReady)
    return (
      <>
        <Flex column css={{ width: '100%', mb: '$1xl' }}>
          <LoadingIndicator />
        </Flex>
      </>
    );

  return (
    <>
      {visible && (
        <Modal
          drawer
          open={visible}
          onOpenChange={onClose}
          css={{
            maxWidth: '460px',
            p: 0,
            border: 'none',
            background:
              'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
            borderRadius: '$3',
            mr: '$md',
            maxHeight: 'calc(100vh - $xl)',
            pb: '$xl',
            '*': {
              color: 'white',
              path: { fill: 'white' },
            },
          }}
        >
          {selectedNodeId && (
            <PartyProfileContent
              address={selectedNodeId}
              css={{ background: 'none', borderRadius: 0 }}
            />
          )}
        </Modal>
      )}
      <ForceGraph2D
        height={height}
        width={width}
        linkCurvature={0.3}
        linkDirectionalParticles={showExtras ? 1 : 0}
        enableZoomInteraction={zoom}
        linkColor={() => {
          return 'rgba(255, 255, 255, .8)';
        }}
        nodeLabel={n => `${(n as node).name}`}
        onNodeClick={(node: NodeObject) => {
          if (showExtras) {
            setSelectedNodeId(node.id as string);
            setVisible(true);
          } else {
            window.open(`${coLinksPaths.partyProfile(node.id as string)}`);
          }
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
    </>
  );
}

const fetchGives = async (skill?: string) => {
  const resp = await fetch('/api/give' + (skill ? `?skill=${skill}` : ''));
  return resp.json() as Promise<{ nodes: node[]; links: link[] }>;
};

const fetchGivesForProfile = async (address: string) => {
  const resp = await fetch(`/api/give/?address=${address}`);
  return resp.json() as Promise<{ nodes: node[]; links: link[] }>;
};
