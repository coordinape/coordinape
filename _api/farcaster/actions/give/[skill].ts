import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getFramePostInfo } from '../../../../api-lib/frames/_getFramePostInfo.tsx';
import { checkAndInsertGive } from '../../../../api-lib/frames/giveparty/checkAndInsertGive.ts';
import { findOrCreateProfileByFid } from '../../../../api-lib/neynar/findOrCreate.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let skill: string | undefined;
  if (typeof req.query.skill == 'string') {
    skill = req.query.skill;
  }

  if (!skill) {
    return res.status(400).json({ message: 'no skill provided' });
  }

  if (req.method === 'POST') {
    return onGiveSkill(req, res, skill);
  } else if (req.method === 'GET') {
    return getSkillAction(req, res, skill);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

const onGiveSkill = async (
  req: VercelRequest,
  res: VercelResponse,
  skill: string
) => {
  try {
    const frameInfo = await getFramePostInfo(req);
    const targetProfile = await findOrCreateProfileByFid(
      frameInfo.message.castId.fid
    );

    await checkAndInsertGive(
      frameInfo,
      frameInfo.message.castId.hash,
      'give_action',
      targetProfile.fc_username,
      skill
    );

    return res.status(200).json({
      type: 'message',
      message: `+GIVE #${skill} to cast! from profileID ${frameInfo.profile.id}`,
      link: `https://coordinape.com/give/leaderboard/${skill}`,
    });
  } catch (e: any) {
    const { message } = e;
    // make sure message is not more than 80 chars:
    if (message.length > 80) {
      e.message = message.slice(0, 80);
    }
    return res.status(400).json({
      message,
    });
  }
};

const getSkillAction = async (
  _req: VercelRequest,
  res: VercelResponse,
  skill: string
) => {
  let desc = `Easily send Coordinape GIVE for #${skill}`;
  if (desc.length > 80) {
    desc = desc.slice(0, 80);
  }

  return res.status(200).json({
    name: `${getEmoji(skill)} GIVE #${skill}`,
    icon: 'ruby',
    description: desc,
    aboutUrl: `https://coordinape.com/give/leaderboard/${skill}`,
    action: {
      type: 'post',
      postUrl: `https://coordinape.com/api/farcaster/actions/give/${skill}`,
    },
  });
};

const getEmoji = (skill: string) => {
  switch (skill) {
    case 'bones':
      return '🦴';
    default:
      return '🎁';
  }
};
