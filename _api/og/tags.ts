import { VercelRequest, VercelResponse } from '@vercel/node';
import { escape } from 'html-escaper';

import { decodeToken } from '../../api-lib/colinks/share';
import { RenderFrameMeta } from '../../api-lib/frames/FrameMeta.tsx';
import { PartyHelpFrame } from '../../api-lib/frames/giveparty/PartyHelpFrame.tsx';
import { ProfileFrame } from '../../api-lib/frames/giveparty/ProfileFrame.tsx';
import { webAppURL } from '../../src/config/webAppURL';

import { getBigQuestionInfo } from './getBigQuestionInfo';
import { getPostInfo } from './getPostInfo';
import { getProfileInfo } from './getProfileInfo';

const appURL = webAppURL('colinks');
const appImg = 'https://coordinape.com/imgs/logo/colinks-favicon.png';
const appDescription = `Coordinape provides tools to discover, recognize and collaborate in onchain networks of trust.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.headers['x-original-path'] as string;
  // const hostname = req.headers['x-original-host'] as string;

  if (!path) {
    return res.status(400).json({ message: 'Missing x-original-path header' });
  }

  // Show the give.party landing frame
  if (path === '/giveparty') {
    RenderFrameMeta({
      frame: PartyHelpFrame(),
      res,
      params: {},
      onlyMetaTags: true,
    });
    return;
  }

  if (path.startsWith('/giveparty/0x')) {
    // TODO: this is brittle
    const address = path.substring(11);
    RenderFrameMeta({
      frame: ProfileFrame(address),
      res,
      params: { address },
      onlyMetaTags: true,
    });
    return;
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
        title: `${profile.name} on Coordinape`,
        description: profile.description ?? 'Member of Coordinape',
        image: `${webAppURL(
          'colinks'
        )}/api/og/profileimage/${encodeURIComponent(address)}`,
        path,
        twitter_card: 'summary_large_image',
      })
    );
  } else if (path.startsWith('/post/')) {
    // if we have a valid share token, render post, otherwise render colinks generic og tags

    try {
      const url = new URL(path, appURL);

      const parts = url.pathname.split('/');
      const id = parts[parts.length - 1];
      const token = url.searchParams.get('s');

      if (!token) {
        console.error('no token found given', { url, parts, token });
        throw new Error('no token found');
      }

      const post = await getPostInfo(id);

      decodeToken(token, post?.profile?.id, id);

      return res.send(
        buildTags({
          title: `Post by ${post?.profile?.name} - Coordinape`,
          description: 'Join the conversation on Coordinape',
          image: `${webAppURL('colinks')}/api/og/postimage/${encodeURIComponent(id)}`,
          path,
          twitter_card: 'summary_large_image',
        })
      );
    } catch (e) {
      console.error('error tagging post', e);
      return res.send(defaultCoLinksTags(path));
    }
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
        title: `The Big Question: ${bq.prompt} - Coordinape`,
        description: bq.prompt,
        image: `${webAppURL('colinks')}/api/og/bqimage/${encodeURIComponent(
          id
        )}`,
        path,
        twitter_card: 'summary_large_image',
      })
    );
  } else {
    return res.send(defaultCoLinksTags(path));
  }
}

const defaultCoLinksTags = (path: string) => {
  return buildTags({
    title: 'Coordinape | The Home of GIVE',
    description: appDescription,
    image: appImg,
    path,
    twitter_card: 'summary',
  });
};

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
    description ?? 'Member of Coordinape'
  )}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${appURL + path}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Coordinape" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="twitter:description" content="${escape(
    description ?? 'Member of Coordinape'
  )}" />
<meta name="twitter:image" content="${escape(image)}" />
<meta name="twitter:url" content="${escape(appURL + path)}" />
<meta name="twitter:card" content="${twitter_card}" />
<meta name="description" content="${escape(title)}" />
`;
};
