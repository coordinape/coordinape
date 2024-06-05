/* eslint-disable no-console */
// import { ThemeContext } from 'features/theming/ThemeProvider';
import { useEffect } from 'react';

import { client } from 'lib/gql/client';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from 'react-query';

import { Box, Text } from 'ui';

export default function MapPage() {
  const fetchData = async () => {
    const { colinks_gives } = await client.query(
      {
        colinks_gives: [
          {},
          {
            id: true,
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
        operationName: 'fetchGraphData',
      }
    );
    return colinks_gives;
  };

  const { data } = useQuery(['give-graph'], fetchData, {
    refetchInterval: 1000 * 30, // 30 seconds
    enabled: !!fetchData,
    select: gives => {
      return {
        nodes: buildNodes(gives),
        links: buildLinks(gives),
      };
    },
  });

  // log data
  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!data)
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );

  return (
    <Box css={{ position: 'relative', height: '100vh' }}>
      <Text>Map:</Text>
      {/* <ThemeContext.Consumer> */}
      {/*   {({ stitchesTheme }) => <AMForceGraph stitchesTheme={stitchesTheme} />} */}
      {/* </ThemeContext.Consumer> */}
      <Graph data={data} />
    </Box>
  );
}

const Graph = ({ data }: { data: { nodes: []; links: [] } }) => {
  return <ForceGraph2D graphData={data} />;
};

const buildNodes = (gives: any) => {
  // construct a node for each giver receiver; TODO add receivers or giver
  const givers = gives.map((give: any) => {
    return {
      id: give.giver_profile_public.address,
      name: give.giver_profile_public.name,
      avatar: give.giver_profile_public.avatar,
    };
  });
  const receivers = gives.map((give: any) => {
    return {
      id: give.target_profile_public.address,
      name: give.target_profile_public.name,
      avatar: give.target_profile_public.avatar,
    };
  });

  return [...givers, ...receivers];
};

const buildLinks = (gives: any) => {
  // construct a link for each give
  return gives.map((give: any) => {
    return {
      source: give.giver_profile_public.address,
      target: give.target_profile_public.address,
    };
  });
};
