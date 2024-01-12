import { VercelRequest, VercelResponse } from '@vercel/node';
import { escape } from 'html-escaper';

import { webAppURL } from '../../src/config/webAppURL';

import { getBigQuestionInfo } from './bqinfo/[id]';
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
        url: req.url as string,
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

    // it's a user!
    return res.send(
      buildTags({
        title: `The Big Question: ${bq.prompt} -  on CoLinks`,
        description: bq.prompt,
        image: `${webAppURL('colinks')}/api/og/bqimage/${encodeURIComponent(
          id
        )}`,
        url: req.url as string,
        twitter_card: 'summary_large_image',
      })
    );
  } else {
    return res.send(
      buildTags({
        title: 'CoLinks',
        description: appDescription,
        image: appImg,
        url: req.url as string,
        twitter_card: 'summary',
      })
    );
  }
}

const buildTags = ({
  title,
  description,
  image,
  url,
  twitter_card,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  twitter_card: 'summary_large_image' | 'summary';
}) => {
  return `
<meta name="description" content="${escape(description)}"/>
<meta property="og:title" content="${escape(title)}" />
<meta property="og:description" content="${escape(
    description ?? 'Member of CoLinks'
  )}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${appURL + url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CoLinks" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="twitter:description" content="${escape(
    description ?? 'Member of CoLinks'
  )}" />
<meta name="twitter:image" content="${escape(image)}" />
<meta name="twitter:url" content="${escape(appURL + url)}" />
<meta name="twitter:card" content="${twitter_card}" />
<meta name="description" content="${escape(title)}" />
`;
};
