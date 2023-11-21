import type { VercelRequest, VercelResponse } from '@vercel/node';

import { updateProfileNFTs } from '../../api/nfts/alchemy';
import { handlerSafe } from '../handlerSafe';
import { EventTriggerPayload } from '../types';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<'link_holders', 'INSERT'> = req.body;
    const { new: row } = payload.event.data;

    // if its the first time they minted their own link
    if (row.holder.toLowerCase() === row.target.toLowerCase()) {
      // eslint-disable-next-line no-console
      console.log('brand new colinks holder, lets get their NFTs');
      const count = await updateProfileNFTs(row.holder as string);
      // eslint-disable-next-line no-console
      console.log(`added ${count} NFTs for new holder ${row.holder}`);
    }
    res.status(200).json({ message: `ok` });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

export default handlerSafe(handler);
