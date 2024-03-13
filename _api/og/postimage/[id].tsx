import { Readable } from 'node:stream';
// @ts-ignore
import type { ReadableStream } from 'node:stream/web';
import React from 'react';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageResponse } from '@vercel/og';

import { getPostInfo } from '../getPostInfo.ts';

import { OgPostImage } from './OgPostImage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let urlPath = req.url as string;
    if (!urlPath.startsWith('http')) {
      urlPath = `https://www.fake.app${urlPath}`;
    }
    const originalUrl = new URL(urlPath);

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

    // @ts-ignore
    Readable.fromWeb(ir.body as ReadableStream<any>).pipe(res);
  } catch (e: any) {
    console.error(`${e.message}`);
    res.status(500).send({ message: 'Failed to generate the image' });
  }
}
