// @ts-nocheck

import React from 'react';

import type { VercelRequest } from '@vercel/node';
import { ImageResponse } from '@vercel/og';
import parse from 'html-react-parser';
import showdown from 'showdown';

export const config = {
  runtime: 'edge',
};
const DEFAULT_AVATAR =
  'https://coordinape-prod.s3.amazonaws.com/default_profile.jpg';

function getRandomColor(colors: string[]): string {
  // Ensure the array is not empty
  if (colors.length === 0) {
    throw new Error('The color array is empty.');
  }

  // Get a random index from the array
  const randomIndex = Math.floor(Math.random() * colors.length);

  // Return the color at the random index
  return colors[randomIndex];
}

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

    const colorArray = ['#ffb3a3', '#daffb8', '#a3c0ff', '#e0caff', '#fdc1e2'];
    const colorArray2 = ['#fff065', '#ecff98', '#aeffac', '#e7f7f4', '#e1ffea'];
    const randomColor = getRandomColor(colorArray);
    const randomColor2 = getRandomColor(colorArray2);
    const converter = new showdown.Converter();
    const html = converter.makeHtml(post.description);

    return new ImageResponse(
      (
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
                    post.profile?.avatar
                      ? process.env.REACT_APP_S3_BASE_URL + post.profile?.avatar
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
                  {post.profile?.name}
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
              {/* {post.description} */}
              {parse(html)}
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
