import { VercelRequest, VercelResponse } from '@vercel/node';

import { webAppURL } from '../../src/config/webAppURL';

import { getProfileInfo } from './profileinfo/[address]';

const appURL = webAppURL('colinks');
const appImg =
  'https://colinks.coordinape.com/imgs/logo/colinks-logo-grey7.png';
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

    console.log('URLYBIRD', req.url);
    const url = new URL(req.url as string);
    // it's a user!
    return res.send(
      buildTags({
        title: `${profile.name} on CoLinks`,
        description: profile.description,
        image: `${url.protocol}://${url.hostname}/og/profile/${address}`,
        url: req.url as string,
      })
    );
  } else {
    return res.send(
      buildTags({
        title: 'CoLinks',
        description: appDescription,
        image: appImg,
        url: appURL,
      })
    );
  }
}

const buildTags = ({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description?: string;
  image: string;
  url: string;
}) => {
  // TODO: html escape/encode the values here, make this JSX?
  return `
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${
    description ?? 'Member of CoLinks'
  }" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CoLinks" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${
    description ?? 'Member of CoLinks'
  }" />
<meta name="twitter:image" content="${appImg}" />
<meta name="twitter:url" content="${appURL}" />
`;
};
