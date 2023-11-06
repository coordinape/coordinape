import React from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingIndicator } from '../components/LoadingIndicator';
import { client } from '../lib/gql/client';
import { Avatar, ContentHeader, Flex, Panel, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

export const RepScorePage = () => {
  const { address } = useParams();
  const { data, isLoading } = useQuery(
    ['repscore', address, 'details'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _eq: address,
                },
              },
            },
            {
              name: true,
              avatar: true,
              reputation_score: {
                total_score: true,
                github_score: true,
                twitter_score: true,
                poap_score: true,
                email_score: true,
                keys_score: true,
                pgive_score: true,
              },
            },
          ],
        },
        {
          operationName: 'repscore_details',
        }
      );
      return profiles_public.pop();
    }
  );

  if (isLoading && data === undefined) {
    return <LoadingIndicator />;
  }
  if (data === undefined) {
    return <Panel>User not found</Panel>;
  }
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex alignItems="center" css={{ gap: '$sm' }}>
          <Avatar
            size="large"
            name={data.name}
            path={data.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Flex column>
            <Text h2 display css={{ color: '$secondaryButtonText' }}>
              {data.name}
            </Text>
            <Text>Reputation Score</Text>
          </Flex>
        </Flex>
      </ContentHeader>
      {!data.reputation_score ? (
        <Panel>No score yet.</Panel>
      ) : (
        <Flex column css={{ maxWidth: '$readable', gap: '$sm' }}>
          <ScoreItem
            big={true}
            title="Total"
            score={data.reputation_score.total_score}
          />
          <ScoreItem
            title="GitHub"
            score={data.reputation_score.github_score}
          />
          <ScoreItem
            title="Twitter"
            score={data.reputation_score.twitter_score}
          />
          <ScoreItem title="POAP" score={data.reputation_score.poap_score} />
          <ScoreItem title="Email" score={data.reputation_score.email_score} />
          <ScoreItem title="Links" score={data.reputation_score.keys_score} />
          <ScoreItem title="PGIVE" score={data.reputation_score.pgive_score} />
        </Flex>
      )}
    </SingleColumnLayout>
  );
};

const ScoreItem = ({
  title,
  score,
  big,
}: {
  title: string;
  score: number;
  big?: boolean;
}) => {
  return (
    <Flex css={{ gap: '$md' }}>
      <Text
        size={big ? 'large' : 'medium'}
        semibold={big ? true : false}
        css={{ width: '100px', justifyContent: 'flex-end' }}
      >
        {score}
      </Text>
      <Text size={big ? 'large' : 'medium'} semibold>
        {title}
      </Text>
    </Flex>
  );
};
