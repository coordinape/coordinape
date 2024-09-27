import { lazy, useCallback, useEffect, useRef, useState } from 'react';

import { StitchesTheme } from 'features/theming/ThemeProvider';
import { NodeObject } from 'react-force-graph-2d';
import { useQuery } from 'react-query';

import { getAvatarPath } from '../../utils/domain';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ProfileDrawerContent } from 'pages/colinks/CoLinksProfilePage/ProfileDrawerContent';
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
  expand = false,
  stitchesTheme,
}: {
  address?: string;
  skill?: string;
  height?: number;
  width?: number;
  zoom?: boolean;
  compact?: boolean;
  expand?: boolean;
  stitchesTheme?: StitchesTheme;
}) {
  const [graphReady, setGraphReady] = useState(false);
  const onClose = () => setVisible(false);
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
  const haveAFewGive = (data?.nodes?.length || 0) > 5;
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
    return () => {
      setVisible(false);
      setSelectedNodeId(null);
    };
  }, []);

  useEffect(() => {
    setVisible(false);
    setSelectedNodeId(null);
  }, [location.pathname]);

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
            maxWidth: 'calc(490px + $md + $md)',
            p: 0,
            border: 'none',
            background: '$background',
            borderRadius: '$3',
            mr: '$md',
            maxHeight: 'calc(100vh - $xl)',
            pb: '$xl',
          }}
        >
          {selectedNodeId && (
            <ProfileDrawerContent
              address={selectedNodeId}
              css={{ background: 'none', borderRadius: 0 }}
            />
          )}
        </Modal>
      )}
      <ForceGraph2D
        height={height}
        width={width}
        minZoom={0.2}
        linkCurvature={0.3}
        linkDirectionalParticles={showExtras ? 1 : 0}
        enableZoomInteraction={zoom}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={0.5}
        linkDirectionalArrowColor={() =>
          stitchesTheme ? stitchesTheme.colors.giveGraphLink.value : 'white'
        }
        linkColor={() => {
          return stitchesTheme
            ? stitchesTheme.colors.giveGraphLink.value
            : 'white';
        }}
        nodeLabel={n => `${(n as node).name}`}
        onNodeClick={(node: NodeObject) => {
          if (showExtras) {
            setSelectedNodeId(node.id as string);
            setVisible(true);
          } else {
            window.open(`${coLinksPaths.profileGive(node.id as string)}`);
          }
        }}
        {...(showExtras ? { nodeCanvasObject } : {})}
        //@ts-ignore TODO: fix types
        ref={graph => {
          if (graph && expand) {
            graph.d3Force('charge').strength(-140);
            graph.d3Force('link').distance(30);
          }
          if (graph && !expand) {
            graph.d3Force('charge').strength(-140);
            graph.d3Force('link').distance(30);
            if (haveAFewGive) {
              graph.zoomToFit(0, 20);
            }
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
