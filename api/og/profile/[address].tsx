import React from 'react';

import type { VercelRequest } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

import { adminClient } from '../../../api-lib/gql/adminClient';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: VercelRequest) {
  try {
    const originalUrl = new URL(req.url as string);

    const parts = originalUrl.pathname.split('/');
    const address = parts[parts.length - 1] ?? 'IDK';

    const url = new URL(
      'https://' +
        originalUrl.hostname +
        '/api/og/profileinfo/' +
        encodeURIComponent(address)
    );
    console.log('fetching', url.toString());

    const { profiles } = await adminClient.query(
      {
        profiles: [
          {
            where: {
              address: {
                _ilike: address,
              },
            },
          },
          {
            reputation_score: {
              total_score: true,
            },
            links: true,
            name: true,
            avatar: true,
          },
        ],
      },
      {
        operationName: 'profileInfoForOgTags',
      }
    );

    // const res = await fetch(url.toString());

    const profile = profiles.pop();
    if (!profile) {
      return new Response(`Failed to generate the image`, {
        status: 404,
      });
    }
    //     : {
    //   avatar: string | undefined;
    //   name: string;
    //   repScore: number;
    //   links: number;
    // } = await res.json();

    console.log('got profile', { profile });
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}
          >
            {/*TODO: NEED A DEFAULT AVATAR IMAGE*/}
            <img
              alt="Vercel"
              height={200}
              src={
                profile.avatar
                  ? process.env.REACT_APP_S3_BASE_URL + profile.avatar
                  : 'https://coordinape-prod.s3.amazonaws.com/assets/static/images/crabsinger-profile_1646249298.png'
              }
              style={{ margin: '0 30px', borderRadius: 99999 }}
              width={200}
            />
          </div>
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8',
              fontSize: 24,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}
          >
            <div>{profile.links} Links</div>
            <div>{profile.reputation_score?.total_score ?? 0} Rep Score</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
