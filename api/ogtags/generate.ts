import { VercelRequest, VercelResponse } from '@vercel/node';

import { webAppURL } from '../../src/config/webAppURL';

const appURL = webAppURL('colinks');
const appImg =
  'https://colinks.coordinape.com/imgs/logo/colinks-logo-grey7.png';
const appDescription = `CoLinks is a network of professionals and friends in the web3 ecosystem`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('HEY');

  const path = req.headers['x-original-path'] as string;

  if (!path) {
    return res.status(400).json({ message: 'Missing x-original-path header' });
  }

  if (path.startsWith('/0x')) {
    // it's a user!
    return res.send(
      buildTags({
        title: 'A USER BRO',
        description: appDescription,
        image: appImg,
        url: appURL,
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
  description: string;
  image: string;
  url: string;
}) => {
  return `

<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CoLinks" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${appImg}" />
<meta name="twitter:url" content="${appURL}" />

`;
};
