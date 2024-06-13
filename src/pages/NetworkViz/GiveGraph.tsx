import { useEffect, useRef, useState } from 'react';

import { anonClient } from 'lib/anongql/anonClient';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { coLinksPaths } from 'routes/paths';
import { Text } from 'ui';

const LIMIT = 50; //000;

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
  skill,
  height = 200,
  zoom = true,
}: {
  skill?: string;
  height?: number;
  zoom?: boolean;
}) {
  const [graphReady, setGraphReady] = useState(false);

  const { data, isLoading, isFetched, refetch } = useQuery(
    ['give-graph', skill ?? 'all-skills'],
    () => {
      return fetchGives(skill);
    },
    {
      // enabled: !!skill,
    }
  );

  const imgCache = useRef({});
  useEffect(() => {
    if (data && isFetched && !graphReady) {
      setGraphReady(true);
      refetch();
      data.nodes.forEach(node => {
        if (node.avatar && !imgCache.current[node.id]) {
          const img = new Image();
          img.src = node.avatar;
          imgCache.current[node.id] = img;
        }
      });
    }
  }, [data, isFetched, setGraphReady]);

  if (!data || isLoading)
    return (
      <>
        <Text>Loading</Text>
        <LoadingIndicator />
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
        nodeCanvasObject={(node, ctx) => {
          try {
            const size = 12;
            if (node.avatar && imgCache.current[node.id]) {
              const img = imgCache.current[node.id];
              // Draw circular clipping path
              ctx.save();
              ctx.beginPath();
              ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(
                img,
                node.x - size / 2,
                node.y - size / 2,
                size,
                size
              );
              ctx.restore();
            } else {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
              ctx.fillStyle = 'black';
              ctx.fill();
              ctx.strokeStyle = 'black';
              ctx.stroke();
            }
          } catch (e) {
            console.error(e);
          }
        }}
        graphData={data}
      />
    );
}

const buildNodes = (gives: any) => {
  const n = new Map<string, node>();
  for (const give of gives) {
    n.set(give.giver_profile_public.address, {
      id: give.giver_profile_public.address,
      name: give.giver_profile_public.name,
      avatar: give.giver_profile_public.avatar,
    });
    n.set(give.target_profile_public.address, {
      id: give.target_profile_public.address,
      name: give.target_profile_public.name,
      avatar: give.target_profile_public.avatar,
    });
  }
  return [...n.values()];
};

const buildLinks = (gives: any) => {
  const links: link[] = gives.map((give: any) => {
    return {
      source: give.giver_profile_public.address,
      target: give.target_profile_public.address,
      skill: give.skill,
    };
  });
  return links;
};

const fetchGives = async (skill?: string) => {
  const { colinks_gives } = await anonClient.query(
    {
      colinks_gives: [
        {
          limit: LIMIT,
          ...(skill
            ? {
                where: {
                  skill: {
                    _eq: skill,
                  },
                },
              }
            : {}),
        },
        {
          id: true,
          skill: true,
          target_profile_public: {
            avatar: true,
            address: true,
            name: true,
          },
          giver_profile_public: {
            avatar: true,
            address: true,
            name: true,
          },
        },
      ],
    },
    {
      operationName: `GiveGraph__fetchGraphData_skill_${skill} @cached(ttl: 300)`,
    }
  );

  return {
    nodes: buildNodes(colinks_gives),
    links: buildLinks(colinks_gives),
  };
};
