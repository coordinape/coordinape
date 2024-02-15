// @ts-nocheck

import React from 'react';

import type { VercelRequest } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

import { OgPostImage } from './OgPostImage';

export const config = {
  runtime: 'edge',
};

export const edge = true;

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
        links: number;
        reputation_score: {
          total_score: number;
        };
      };
    } = await res.json();

    return new ImageResponse(
      (
        <OgPostImage
          description={post.description}
          name={post.profile.name}
          avatar={post.profile.avatar}
          links={post.profile.links}
          rep={post.profile.reputation_score.total_score}
          scale={2}
        />
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
