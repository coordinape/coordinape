import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse } from '../../api-lib/HttpError.ts';

import { CACHE_CONTENT, fetchCoLinksGives } from './index.ts';

// 1 hour

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let skill: string | undefined;
    if (typeof req.query.skill === 'string' && req.query.skill.length > 0) {
      skill = req.query.skill;
    }

    const data = await fetchCoLinksGives(skill);

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}
