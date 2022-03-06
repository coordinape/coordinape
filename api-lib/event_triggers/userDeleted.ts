import type { VercelRequest, VercelResponse } from '@vercel/node';

import { EventTriggerPayload } from '../types';
import userReset from '../userReset';

export default async function (req: VercelRequest, res: VercelResponse) {
  // no parsing should be needed here since this data comes straight from
  // the database and zeus keeps this consistent for us
  const {
    event: { data },
  }: EventTriggerPayload<'users', 'UPDATE'> = req.body;

  if (data.old.deleted_at || !data.new.deleted_at) {
    // user wasn't just deleted, so nothing to do
    return res
      .status(200)
      .json({ message: `user wasn't soft deleted, nothing to do` });
  }

  await userReset(data.old.id);

  return res.status(200).json({
    message: `user deletion refunds completed`,
    // results,
  });
}
