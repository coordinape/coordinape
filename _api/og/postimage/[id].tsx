import React from 'react';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

import { getPostInfo } from '../getPostInfo.ts';

import { OgPostImage } from './OgPostImage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const originalUrl = new URL(req.url as string);

    const parts = originalUrl.pathname.split('/');
    const id = parts[parts.length - 1] ?? 'IDK';

    const post = await getPostInfo(id);
    if (!post?.profile) {
      return res.status(404).send({
        message: 'profile not found',
      });
    }

    const ir = new ImageResponse(
      (
        <OgPostImage
          description={post.description}
          name={post.profile.name}
          avatar={post.profile.avatar}
          links={post.profile.links}
          rep={post.profile.reputation_score?.total_score ?? 0}
          scale={2}
        />
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    const ab = await ir.arrayBuffer();
    const buf = Buffer.from(ab);
    res.setHeader('Content-Type', 'image/png');
    return res.send(buf);
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
