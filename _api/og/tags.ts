import { VercelRequest, VercelResponse } from '@vercel/node';
import { escape } from 'html-escaper';

import { decodeToken } from '../../api-lib/colinks/share';
import { webAppURL } from '../../src/config/webAppURL';

import { getBigQuestionInfo } from './getBigQuestionInfo';
import { getPostInfo } from './getPostInfo';
import { getProfileInfo } from './getProfileInfo';

const appURL = webAppURL('colinks');
const appImg = 'https://colinks.coordinape.com/imgs/logo/colinks-favicon.png';
const appDescription = `CoLinks is a network of professionals and friends in the web3 ecosystem`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.headers['x-original-path'] as string;
  // const hostname = req.headers['x-original-host'] as string;

  if (!path) {
    return res.status(400).json({ message: 'Missing x-original-path header' });
  }

  // Show the give.party landing frame
  if (path === '/giveparty') {
    return res.send(
      buildGivePartyFrameTags({
        title: `give.party`,
        description: `give.party by Coordinape`,
        image: `${webAppURL('colinks')}/api/frames/router/img/party.help`,
        path,
        twitter_card: 'summary_large_image',
        postURL: `${webAppURL('colinks')}/api/frames/router/meta/party.help`,
      })
    );
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
          title: `Post by ${post?.profile?.name} - CoLinks`,
          description: 'Join the conversation on CoLinks',
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
    return res.send(defaultCoLinksTags(path));
  }
}

const defaultCoLinksTags = (path: string) => {
  return buildTags({
    title: 'CoLinks',
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

const buildGivePartyFrameTags = ({
  title,
  description,
  image,
  path,
  twitter_card,
  postURL,
}: {
  title: string;
  description: string;
  image: string;
  path: string;
  postURL: string;
  twitter_card: 'summary_large_image' | 'summary';
}) => {
  return `
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:post_url" content="${postURL}" />
<meta property="fc:frame:image" content="${image}" />
<meta
  property="fc:frame:image:aspect_ratio"
  content="1.91:1"
/>
//         TODO BUTTONS
/*
   {
        title: 'Start the Party',
        action: 'post',
        onPost: prepareParty,
      },
      {
        title: 'Learn More',
        action: 'link',
        target: 'https://give.party',
      },
 */
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CoLinks" />

<meta name="fc:frame:button:1" content="Start the Party" />
<meta name="fc:frame:button:1:action" content="post" />

<meta name="fc:frame:button:2" content="Learn More" />
<meta name="fc:frame:button:2:action" content="link" />
<meta name="fc:frame:button:2:target" content="https://give.party"/>


<meta property="og:image" content="${escape(image)}" />
<meta name="twitter:image" content="${escape(image)}" />

<meta property="og:url" content="${escape(appURL + path)}" />
<meta name="twitter:url" content="${escape(appURL + path)}" />
<meta name="twitter:card" content="${twitter_card}" />

<meta name="description" content="${escape(description)}"/>
<meta property="og:description" content="${escape(
    description ?? 'Member of CoLinks'
  )}" />
<meta name="twitter:description" content="${escape(
    description ?? 'Member of CoLinks'
  )}"/>

<meta property="og:title" content="${escape(title)}" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="description" content="${escape(title)}" />
`;
};
