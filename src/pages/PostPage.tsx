import assert from 'assert';
import React from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../components';
import { ActivityRow } from '../features/activities/ActivityRow';
import { activitySelector } from '../features/activities/useInfiniteActivities';
import { client } from '../lib/gql/client';
import { Flex, Panel, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';
// import { MarkdownPreviewOG } from 'ui/MarkdownPreview/MarkdownPreviewOG';

export const POST_PAGE_QUERY_KEY = 'colinks_post_page';
// const DEFAULT_AVATAR =
//   'https://coordinape-prod.s3.amazonaws.com/default_profile.jpg';
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

// function getRandomColor(colors: string[]): string {
//   // Ensure the array is not empty
//   if (colors.length === 0) {
//     throw new Error('The color array is empty.');
//   }

//   // Get a random index from the array
//   const randomIndex = Math.floor(Math.random() * colors.length);

//   // Return the color at the random index
//   return colors[randomIndex];
// }

export const PostPage = () => {
  const { id } = useParams();
  assert(id);
  // const colorArray = ['#ffb3a3', '#daffb8', '#a3c0ff', '#e0caff', '#fdc1e2'];
  // const colorArray2 = ['#fff065', '#ecff98', '#aeffac', '#e7f7f4', '#e1ffea'];
  // const randomColor = getRandomColor(colorArray);
  // const randomColor2 = getRandomColor(colorArray2);
  const { data: post, isLoading } = useQuery([POST_PAGE_QUERY_KEY, id], () =>
    fetchPost(Number(id))
  );

  if (!post && isLoading) {
    return <LoadingModal visible={true} />;
  }
  if (!post || (!post.private_stream && !post.big_question)) {
    return (
      <Panel alert css={{ m: '$xl' }}>
        <Text>Post not viewable. You probably do not have access to it</Text>
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
      {/*<CoLinksBasicProfileHeader*/}
      {/*  address={post.actor_profile_public.address}*/}
      {/*  title={post.big_question ? 'The Big Question Answer' : 'Post'}*/}
      {/*/>*/}
      <Flex
        column
        css={{
          gap: '$xl',
          maxWidth: '$readable',
          '.contributionRow, .markdownPreview': {
            cursor: 'default',
          },
        }}
      >
        <ActivityRow key={post.id} activity={post} focus={true} />
      </Flex>
      {/* <Flex css={{ width: 1200, height: 630 }}>
        <div
          style={{
            background: `linear-gradient(45deg, ${randomColor} 0%, ${randomColor2} 100%)`,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            padding: '40px',
            aspectRatio: '2/1',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                paddingBottom: '20px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <img
                  alt="avatar"
                  src={
                    post.actor_profile_public?.avatar
                      ? process.env.REACT_APP_S3_BASE_URL +
                        '/' +
                        post.actor_profile_public?.avatar
                      : DEFAULT_AVATAR
                  }
                  style={{ margin: '0 24px 0 0', borderRadius: 99999 }}
                  height={120}
                  width={120}
                />
                <h1
                  style={{
                    margin: 0,
                    fontSize: 80,
                    fontFamily: 'Denim, sans-serif',
                  }}
                >
                  {post.actor_profile_public?.name}
                </h1>
              </div>
              <img
                style={{ height: '100px' }}
                src={
                  'https://colinks.coordinape.com/imgs/logo/colinks-logo-grey7.png'
                }
                alt="colinks logo"
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                textAlign: 'left',
                width: '100%',
                fontSize: 40,
                lineHeight: 1.3,
              }}
            >
              <MarkdownPreviewOG source={post.contribution?.description} />
            </div>
          </div>
        </div>
      </Flex> */}
    </SingleColumnLayout>
  );
};
