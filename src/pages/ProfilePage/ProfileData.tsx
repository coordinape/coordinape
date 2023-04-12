/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'assert';
import { useEffect, useRef } from 'react';

import * as Plot from '@observablehq/plot';
import { useLoginData } from 'features/auth';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { Box, Flex, Text } from 'ui';

import type { Awaited } from 'types/shim';

type QueryResult = Awaited<ReturnType<typeof getGiveData>>;

const ProfileData = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const profile = useLoginData();
  const profileAddress = profile?.address;

  assert(profileAddress);

  const { data } = useQuery(
    ['profileData__getGiveData', { profileAddress: profileAddress }],
    () => getGiveData({ profileAddress: profileAddress }),
    {
      enabled: !!profileAddress,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      select: (data: QueryResult) => {
        return {
          epochs: data.epochs.map(epoch => {
            return {
              ...epoch,
              circle_name: epoch?.circle?.name,
              token_sum: epoch.token_gifts_aggregate.aggregate?.sum?.tokens,
            };
          }),
        };
      },
    }
  );

  useEffect(() => {
    if (data) {
      console.log({ data });
      const chart = Plot.plot({
        width: 900,
        height: 700,
        grid: true,
        marks: [
          // Create line mark
          Plot.line(data.epochs, {
            x: 'end_date',
            y: 'token_sum',
            stroke: 'circle_name',
          }),

          // Create a dot mark
          Plot.dot(data.epochs, {
            x: 'end_date',
            y: 'token_sum',
            fill: 'circle_name',
          }),

          // Display a horizontal line at y=0
          Plot.ruleY([0]),
        ],
        color: {
          legend: true,
          scheme: 'viridis',
        },
      });

      if (chartRef.current) {
        chartRef.current.appendChild(chart);
      }
      return () => {
        chart.remove();
      };
    }
  }, [data]);

  return (
    <Flex column css={{ alignItems: 'center' }}>
      <Text p>Profile Data</Text>
      <Box>Some stuff here</Box>
      <div ref={chartRef} />
    </Flex>
  );
};

export const getGiveData = async ({
  profileAddress,
}: {
  profileAddress: string;
}) => {
  return client.query(
    {
      epochs: [
        {
          where: { ended: { _eq: true } },
          order_by: [{ start_date: order_by.desc }],
        },
        {
          id: true,
          end_date: true,
          circle: { name: true },
          token_gifts_aggregate: [{}, { aggregate: { sum: { tokens: true } } }],
        },
      ],
    },
    //   token_gifts: [
    //     {
    //       where: {
    //         recipient_address: { _eq: profileAddress },
    //         circle_id: { _eq: 30 },
    //       },
    //     },
    //     {
    //       id: true,
    //       circle_id: true,
    //       circle: {
    //         name: true,
    //       },
    //       epoch_id: true,
    //       epoch: {
    //         end_date: true,
    //       },
    //       sender_profile: {
    //         name: true,
    //         id: true,
    //       },
    //       tokens: true,
    //     },
    //   ],
    // },
    {
      operationName: 'profileData__getGiveData',
    }
  );
};

export default ProfileData;
