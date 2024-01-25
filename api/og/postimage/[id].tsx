// @ts-nocheck

import React from 'react';

import type { VercelRequest } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

// import { MarkdownPreview } from '../../../src/ui';

export const config = {
  runtime: 'edge',
};
const DEFAULT_AVATAR =
  'https://coordinape-prod.s3.amazonaws.com/default_profile.jpg';
export default async function handler(req: VercelRequest) {
  try {
    const originalUrl = new URL(req.url as string);

    const parts = originalUrl.pathname.split('/');
    const id = parts[parts.length - 1] ?? 'IDK';

    const url = new URL(
      'https://' +
        originalUrl.hostname +
        '/api/og/postinfo/' +
        encodeURIComponent(id)
    );

    const res = await fetch(url.toString());

    const post: {
      description: string;
      profile: {
        name: string;
        avatar: string | undefined;
      };
    } = await res.json();

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(45deg, #ddd 0%, #fff 100%)',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            padding: '10px 20px',
            aspectRatio: '2/1',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
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
                padding: '10px 0',
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
                    post.profile?.avatar
                      ? process.env.REACT_APP_S3_BASE_URL + post.profile?.avatar
                      : DEFAULT_AVATAR
                  }
                  style={{ margin: '0 10px 0 0', borderRadius: 99999 }}
                  height={50}
                  width={50}
                />
                <h1 style={{ margin: 0 }}>{post.profile?.name}</h1>
              </div>
              <img
                style={{ height: '45px' }}
                src={'/imgs/logo/colinks-logo-grey7.png'}
                alt="colinks logo"
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {post.description}
              {/* <MarkdownPreview
                render
                source={post.description}
                css={{ cursor: 'auto', mb: '-$xs', mt: '$xs' }}
              /> */}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
