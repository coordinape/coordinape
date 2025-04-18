import React from 'react';

import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import { getGiveWeight, isBotOrAgent } from '../../give.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { Frame, isFrame, ResourceIdentifierWithParams } from '../frames.ts';
import { checkAndInsertGive } from '../giveparty/checkAndInsertGive.ts';
import { GivePartyHomeFrame } from '../giveparty/GivePartyHomeFrame.tsx';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

import { fetchProfileInfo } from './fetchProfileInfo.tsx';
import { getContextFromParams } from './getContextFromParams.ts';
import { getLevelForViewer } from './getLevelForViewer.tsx';
import { giveResourceIdentifier } from './giveResourceIdentifier.ts';

const homeFrameImageNode = async (params: Record<string, string>) => {
  const { give } = await getContextFromParams(params);
  const { numGiveSent: giverTotalGiven } = await fetchProfileInfo(
    give.giver_profile_public.id
  );
  const { numGiveReceived: receiverTotalReceived } = await fetchProfileInfo(
    give.target_profile_public.id
  );
  const giverLevel = await getLevelForViewer(give.giver_profile_public.id);
  const randomArtNumber = (give.id % 5) + 1;

  const bgImage = give.image_url
    ? `${give.image_url}?format=jpeg`
    : `frontdoor-${giverLevel}-${randomArtNumber}.jpg`;

  const isBot = isBotOrAgent(give.giver_profile_public.id);
  const give_weight = getGiveWeight({
    profileId: give.giver_profile_public.id,
    total_score: give.giver_profile_public.reputation_score?.total_score,
  });

  const getDiceImage = (give_weight: number, isBot: boolean): string => {
    if (isBot) return 'bot.png';
    if (give_weight >= 10000) return 'dice-d20.png';
    if (give_weight >= 5000) return 'dice-d12.png';
    if (give_weight >= 3000) return 'dice-d10.png';
    if (give_weight >= 1500) return 'dice-d8.png';
    if (give_weight >= 500) return 'dice-d6.png';
    return 'dice-d4.png';
  };

  return (
    <FrameWrapper>
      <div tw="flex flex-col relative">
        <div tw="flex relative">
          <FrameBgImage src={bgImage} />
        </div>
        <div
          tw="flex flex-col absolute"
          style={{
            right: 50,
            top: 0,
            width: 158,
            height: 228,
            backgroundImage: `url(${IMAGE_URL_BASE}banner.png)`,
            backgroundSize: '158px 228px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            tw="flex flex-col relative justify-center items-center"
            style={{ gap: 4, paddingTop: 10 }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                borderBottom: '1px solid white',
              }}
            >
              WEIGHT
            </span>
            <span style={{ fontSize: 34, fontWeight: 600 }}>{give_weight}</span>
            <img
              alt="d"
              src={`${IMAGE_URL_BASE}${getDiceImage(give_weight, isBot)}`}
              width={66}
              height={66}
            />
          </div>
        </div>
      </div>
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              giverLevel == 4 || give.skill === 'bones'
                ? 'radial-gradient(circle at 25% 0%, #E31A1A 0%, #790066 80%)'
                : giverLevel == 3
                  ? 'radial-gradient(circle at 25% 0%, #3300FF 0%, #EF7200 80%)'
                  : giverLevel == 2
                    ? 'radial-gradient(circle at 25% 0%, #0DC0E7 0%, #7908D2 80%)'
                    : giverLevel == 1
                      ? 'radial-gradient(circle at 25% 0%, #04AFF9 0%, #FFB800 80%)'
                      : 'radial-gradient(circle at 25% 0%, #135A95 0%, #092031 80%)',

            opacity: 1,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={give.giver_profile_public.avatar} />

          <div
            tw="flex flex-col items-center grow justify-center relative"
            style={{ lineHeight: 1, gap: 8 }}
          >
            <div tw="flex items-center grow justify-center" style={{ gap: 20 }}>
              +1
              <img
                alt="gem"
                src={IMAGE_URL_BASE + 'GemWhite.png'}
                width={70}
                height={70}
              />
              <span>GIVE</span>
            </div>
            {give.skill && (
              <span
                style={{
                  position: 'absolute',
                  bottom: -47,
                  fontSize: 34,
                  background: 'rgba(45,45,60,0.75)',
                  padding: '8px 24px 8px 25px',
                  borderRadius: 99,
                }}
              >
                #{give.skill}
              </span>
            )}
          </div>
          <OGAvatar avatar={give.target_profile_public.avatar} />
        </FrameHeadline>
        <FrameFooter>
          <div
            tw="flex w-full items-center justify-between"
            style={{ fontWeight: 400 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>
                {give.giver_profile_public.name}
              </span>
              <span>
                Total Given{' '}
                <span style={{ fontWeight: 600, paddingLeft: '.5rem' }}>
                  {giverTotalGiven}
                </span>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {give.target_profile_public.name}
              </span>
              <span>
                Total Received{' '}
                <span style={{ fontWeight: 600, paddingLeft: '.5rem' }}>
                  {receiverTotalReceived}
                </span>
              </span>
            </div>
          </div>
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

// const _onPost = async (info: FramePostInfo, params: Record<string, string>) => {
//   // who are you? which frame to return
//   const { give } = await getContextFromParams(params);
//   if (!give || !give.target_profile_public || !give.giver_profile_public) {
//     throw new NotFoundError('give not found');
//   }
//
//   // Enter the Levels persona app
//   const level = await getLevelForViewer(info.profile.id);
//
//   const relation =
//     info.profile.id === give.giver_profile_public.id
//       ? 'giver'
//       : info.profile.id === give.target_profile_public.id
//         ? 'receiver'
//         : 'other';
//
//   await insertInteractionEvents({
//     event_type: 'home_frame_click',
//     profile_id: info.profile.id,
//     data: {
//       give_bot: true,
//       frame: 'give',
//       profile_level: level,
//       give_id: give.id,
//       clicker_relation: relation,
//       clicker_name: info.profile.name,
//       giver_id: give.giver_profile_public.id,
//       receiver_id: give.target_profile_public.id,
//       giver_name: give.giver_profile_public.name,
//       receiver_name: give.target_profile_public.name,
//     },
//   });
//
//   // route each level to its respective Persona
//   if (level === 1) {
//     return PersonaOneFrame;
//   } else if (level === 2) {
//     return PersonaTwoFrame;
//   } else if (level === 3) {
//     return PersonaThreeFrame;
//   } else if (level === 4) {
//     return PersonaFourFrame;
//   } else {
//     return PersonaZeroFrame;
//   }
// };

export const onSendGIVEPost = async (
  info: FramePostInfo,
  params: Record<string, string>
) => {
  const { give } = await getContextFromParams(params);

  const {
    inputText: target_username,
    castId: { hash: cast_hash },
  } = info.message;

  let giveId: number | undefined;
  try {
    giveId = await checkAndInsertGive(
      info,
      cast_hash,
      GivePartyHomeFrame().id,
      target_username,
      give.skill
    );
  } catch (e: any) {
    if (isFrame(e)) {
      return e;
    }
    return GivePartyHomeFrame(e.message, give.skill);
  }

  return GiveHomeFrame(giveId.toString());
};

export const GiveHomeFrame = (giveId?: string): Frame => ({
  id: 'give',
  homeFrame: true,
  resourceIdentifier: ResourceIdentifierWithParams(
    giveResourceIdentifier,
    giveId
      ? {
          giveId,
        }
      : {}
  ),
  imageNode: homeFrameImageNode,
  inputText: async params => {
    const { give } = await getContextFromParams(params);
    let inputText = `@username to GIVE #${give.skill}`;
    if (inputText.length > 25) {
      inputText = inputText.substring(0, 22) + '...';
    }
    return inputText;
  },
  buttons: [
    {
      title: 'View Leaderboard',
      action: 'link',
      target: async params => {
        const { give } = await getContextFromParams(params);
        return `https://coordinape.com/give/leaderboard/${encodeURIComponent(give.skill)}`;
      },
    },
    {
      title: 'Send GIVE 🎁',
      action: 'post',
      onPost: onSendGIVEPost,
    },
  ],
});
