import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../../../api-lib/HttpError';
//
// const addEmailInput = z
//   .object({
//     subject: zEthAddressOnly,
//   })
//   .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // const {
    //   payload,
    //   // session: { hasuraProfileId },
    // } = await getInput(req, addEmailInput);

    // get the existing keys for this subject from db

    // get all the keys for this subject and make they are correct in the db

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
