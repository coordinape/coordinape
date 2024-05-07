import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { isFrame } from '../frames.ts';

import { checkAndInsertGive } from './checkAndInsertGive.ts';
import { getContextFromParams } from './getContextFromParams.ts';
import { GivePartyHomeFrame } from './GivePartyHomeFrame.tsx';
import { JoinedPartyFrame } from './JoinedPartyFrame.tsx';

export const onSendGIVEPost = async (
  info: FramePostInfo,
  params: Record<string, string>
) => {
  // who are you? which frame to return
  const { skill } = await getContextFromParams(params);

  const {
    inputText: target_username,
    castId: { hash: cast_hash },
  } = info.message;

  try {
    await checkAndInsertGive(
      info,
      cast_hash,
      GivePartyHomeFrame().id,
      target_username,
      skill
    );
  } catch (e: any) {
    if (isFrame(e)) {
      return e;
    }
    return GivePartyHomeFrame(e.message);
  }

  return JoinedPartyFrame;
};
