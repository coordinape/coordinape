import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { isFrame } from '../frames.ts';

import { checkAndInsertGive } from './checkAndInsertGive.ts';
import { getSurpriseContextFromParams } from './getSurpriseContextFromParams.ts';
import { JoinedSurprisePartyFrame } from './JoinedSurprisePartyFrame.tsx';
import { SurprisePartyHomeFrame } from './SurprisePartyHomeFrame.tsx';

export const onSendSurpriseGIVEPost = async (
  info: FramePostInfo,
  params: Record<string, string>
) => {
  // who are you? which frame to return
  const { username: target_username } =
    await getSurpriseContextFromParams(params);

  const {
    inputText: skill,
    castId: { hash: cast_hash },
  } = info.message;

  try {
    await checkAndInsertGive(info, cast_hash, target_username, skill);
  } catch (e: any) {
    if (isFrame(e)) {
      return e;
    }
    return SurprisePartyHomeFrame(e.message);
  }

  return JoinedSurprisePartyFrame;
};
