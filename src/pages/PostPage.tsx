import assert from 'assert';
import React from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../components';
import { ActivityRow } from '../features/activities/ActivityRow';
import { activitySelector } from '../features/activities/useInfiniteActivities';
import { CoLinksBasicProfileHeader } from '../features/colinks/CoLinksBasicProfileHeader';
import { client } from '../lib/gql/client';
import { Flex, Panel, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

export const POST_PAGE_QUERY_KEY = 'colinks_post_page';

const fetchPost = async (id: number) => {
  const { activities_by_pk } = await client.query(
    {
      activities_by_pk: [
        {
          id: id,
        },
        activitySelector,
      ],
    },
    {
      operationName: 'fetchPost',
    }
  );
  return activities_by_pk;
};

export const PostPage = () => {
  const { id } = useParams();
  assert(id);
  const { data: post, isLoading } = useQuery([POST_PAGE_QUERY_KEY, id], () =>
    fetchPost(Number(id))
  );

  if (!post && isLoading) {
    return <LoadingModal visible={true} />;
  }
  if (!post || !post.private_stream) {
    return (
      <Panel alert css={{ m: '$xl' }}>
        <Text>Post not found.</Text>
      </Panel>
    );
  }
  if (!post.actor_profile_public?.address) {
    return (
      <Panel alert css={{ m: '$xl' }}>
        <Text>{`User doesn't exist.`}</Text>
      </Panel>
    );
  }

  return (
    <SingleColumnLayout>
      <CoLinksBasicProfileHeader
        address={post.actor_profile_public.address}
        title={'Post'}
      />
      <Flex
        column
        css={{
          maxWidth: '$readable',
          '.contributionRow, .markdownPreview': {
            cursor: 'default',
          },
        }}
      >
        <ActivityRow key={post.id} activity={post} focus={true} />
      </Flex>
    </SingleColumnLayout>
  );
};
