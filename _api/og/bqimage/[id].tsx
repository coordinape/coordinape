// @ts-nocheck

import React from 'react';

import type { VercelRequest } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

export const edge = true;

export const config = {
  runtime: 'edge',
};

export default async function handler(req: VercelRequest) {
  try {
    const originalUrl = new URL(req.url as string);

    const parts = originalUrl.pathname.split('/');
    const id = parts[parts.length - 1] ?? 'IDK';

    const url = new URL(
      'https://' +
        originalUrl.hostname +
        '/api/og/bqinfo/' +
        encodeURIComponent(id)
    );

    const res = await fetch(url.toString());

    const bq: {
      cover_image_url: string;
      prompt: string;
      css_background_position: string | undefined;
    } = await res.json();

    return new ImageResponse(
      (
        <div
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${bq.css_background_position ?? 'center'}`,
            backgroundSize: 'cover',
            backgroundImage: `url('${bq.cover_image_url}')`,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            padding: '72px 32px',
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
                fontSize: '32px',
                alignItems: 'flex-start',
                color: '#ffffffee',
                fontStyle: 'italic',
                background: 'rgba(0,0,0,0.8)',
                paddingLeft: 8,
                paddingRight: 8,
                width: 'auto',
                display: 'flex',
              }}
            >
              The Big Question
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '72px',
                color: 'white',
                width: '100%',
                textShadow: 'rgb(0 0 0 / 64%) 1px 1px 8px',
              }}
            >
              {bq.prompt}
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
