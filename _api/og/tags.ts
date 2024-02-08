/* eslint-disable no-console */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { escape } from 'html-escaper';

import { decodeToken } from '../../api-lib/colinks/share';
import { webAppURL } from '../../src/config/webAppURL';

import { getBigQuestionInfo } from './bqinfo/[id]';
import { getPostInfo } from './postinfo/[id]';
import { getProfileInfo } from './profileinfo/[address]';

const appURL = webAppURL('colinks');
const appImg = 'https://colinks.coordinape.com/imgs/logo/colinks-favicon.png';
const appDescription = `CoLinks is a network of professionals and friends in the web3 ecosystem`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.headers['x-original-path'] as string;

  if (!path) {
    return res.status(400).json({ message: 'Missing x-original-path header' });
  }

  if (path.startsWith('/0x')) {
    const address = path.substring(1);

    // get the stuff
    const profile = await getProfileInfo(address);
    if (!profile) {
      return res.status(404).send({
        message: 'No profile found',
      });
    }

    // it's a user!
    return res.send(
      buildTags({
        title: `${profile.name} on CoLinks`,
        description: profile.description ?? 'Member of CoLinks',
        image: `${webAppURL(
          'colinks'
        )}/api/og/profileimage/${encodeURIComponent(address)}`,
        path,
        twitter_card: 'summary_large_image',
      })
    );
  } else if (path.startsWith('/post/')) {
    const parts = path.split('/');
    const id = parts[parts.length - 1];

    // get the share token from query string and verify it
    const token = new URLSearchParams(path.split('?')[1]).get('s');

    // eslint-disable-next-line no-console
    // console.log('parsed token from url as', { token, path });

    const post = await getPostInfo(id);
    console.log('got post');

    let validToken = false;
    if (token) {
      try {
        decodeToken(token, post?.profile?.id, id);
        validToken = true;
      } catch (e) {
        // TODO: if the hmac is bad or whatever, don't throw an error just return stripped OG tag without post contents
        console.error('failed to decode token', e);
      }
    }

    if (!post) {
      return res.status(404).send({
        message: 'No post found',
      });
    }

    // it's a post!
    return res.send(
      buildTags({
        title: `Post by ${post.profile?.name} - CoLinks`,
        description: 'Join the conversation on CoLinks',
        image: validToken
          ? `${webAppURL('colinks')}/api/og/postimage/${encodeURIComponent(id)}`
          : appImg,
        path,
        twitter_card: 'summary_large_image',
      })
    );
  } else if (path.startsWith('/bigquestion/')) {
    const parts = path.split('/');
    const id = parts[parts.length - 1];

    // get the stuff
    const bq = await getBigQuestionInfo(id);
    if (!bq) {
      return res.status(404).send({
        message: 'No bq found',
      });
    }

    // it's a big q!
    return res.send(
      buildTags({
        title: `The Big Question: ${bq.prompt} - CoLinks`,
        description: bq.prompt,
        image: `${webAppURL('colinks')}/api/og/bqimage/${encodeURIComponent(
          id
        )}`,
        path,
        twitter_card: 'summary_large_image',
      })
    );
  } else {
    return res.send(
      buildTags({
        title: 'CoLinks',
        description: appDescription,
        image: appImg,
        path,
        twitter_card: 'summary',
      })
    );
  }
}

const buildTags = ({
  title,
  description,
  image,
  path,
  twitter_card,
}: {
  title: string;
  description: string;
  image: string;
  path: string;
  twitter_card: 'summary_large_image' | 'summary';
}) => {
  return `
<meta name="description" content="${escape(description)}"/>
<meta property="og:title" content="${escape(title)}" />
<meta property="og:description" content="${escape(
    description ?? 'Member of CoLinks'
  )}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${appURL + path}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CoLinks" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="twitter:description" content="${escape(
    description ?? 'Member of CoLinks'
  )}" />
<meta name="twitter:image" content="${escape(image)}" />
<meta name="twitter:url" content="${escape(appURL + path)}" />
<meta name="twitter:card" content="${twitter_card}" />
<meta name="description" content="${escape(title)}" />
`;
};
