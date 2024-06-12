import { useEffect, useState } from 'react';

import { anonClient } from 'lib/anongql/anonClient';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from 'react-query';

import { coLinksPaths } from 'routes/paths';
import { Text } from 'ui';

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

export default function GiveGraph({
  skill,
  width = 200,
  height = 200,
}: {
  skill?: string;
  width?: number;
  height?: number;
}) {
  const [graphReady, setGraphReady] = useState(false);

  const { data, isLoading, isFetched, refetch } = useQuery(
    ['give-graph', skill],
    () => {
      if (!skill) return;
      return fetchGives(skill);
    },
    {
      enabled: !!skill,
    }
  );

  useEffect(() => {
    if (data && isFetched && !graphReady) {
      setGraphReady(true);
      refetch();
    }
  }, [data, isFetched, setGraphReady]);

  if (!data || isLoading) return <Text>Loading...</Text>;

  if (graphReady)
    return (
      <ForceGraph2D
        height={height}
        linkCurvature={0.3}
        linkDirectionalParticles={1}
        linkColor={() => {
          return 'rgba(255, 255, 255, .8)';
        }}
        nodeAutoColorBy={'id'}
        nodeLabel={n => `${n.name}`}
        onNodeClick={node => {
          window.open(`${coLinksPaths.partyProfile(node.id)}`);
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

const fetchGives = async (skill: string) => {
  const { colinks_gives } = await anonClient.query(
    {
      colinks_gives: [
        {
          limit: 25000,
          where: {
            skill: {
              _eq: skill,
            },
          },
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
      operationName: 'GiveGraph__fetchGraphData @cached(ttl: 1800)',
    }
  );

  return {
    nodes: buildNodes(colinks_gives),
    links: buildLinks(colinks_gives),
  };
};
