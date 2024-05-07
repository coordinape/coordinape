import React from 'react';

import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { Frame } from '../frames.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { getLevelForViewer } from '../give/getLevelForViewer.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FramePersonaHeadline } from '../layoutFragments/FramePersonaHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { getSurpriseContextFromParams } from './getSurpriseContextFromParams.ts';
import { onSendSurpriseGIVEPost } from './onSendSurpriseGIVEPost.tsx';
import { SurprisePartyHelpFrame } from './SurprisePartyHelpFrame.tsx';
import { usernameResourceIdentifier } from './usernameResourceIdentifier.ts';

export function getRandomColor(colors: string[]): string {
  // Ensure the array is not empty
  if (colors.length === 0) {
    throw new Error('The color array is empty.');
  }
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
export const gradientArray = [
  'radial-gradient(circle at 25% 0%, #7516BF 30%, #00AEF9 100%)',
  'radial-gradient(circle at 25% 0%, #C528AC 30%, #09B5B5 100%)',
  'radial-gradient(circle at 25% 0%, #09B5B5 30%, #FF1FFF 100%)',
  'radial-gradient(circle at 25% 0%, #129AD5 30%, #B40CEF 100%)',
  'radial-gradient(circle at 25% 0%, #E96DD5 30%, #5200FF 100%)',
  'radial-gradient(circle at 25% 0%, #00B489 30%, #AE01FF 100%)',
  'radial-gradient(circle at 25% 0%, #9E3DFF 30%, #86ABF1 100%)',
  'radial-gradient(circle at 25% 0%, #4C55AB 30%, #FF5FFF 100%)',
  'radial-gradient(circle at 25% 0%, #00B393 30%, #19C8FF 100%)',
];
const randomGradient = getRandomColor(gradientArray);

const imageNode = async (params: Record<string, string>) => {
  const { username } = await getSurpriseContextFromParams(params);
  const { viewerProfile } = await getViewerFromParams(params);
  const {
    numGiveSent: giverTotalGiven,
    numGiveReceived: receiverTotalReceived,
  } = await fetchProfileInfo(viewerProfile?.id);
  const { give } = await fetchPoints(viewerProfile?.id);
  const level = await getLevelForViewer(viewerProfile?.id);

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background: randomGradient,
        }}
      />
      <div
        tw="flex flex-col h-full w-full justify-between"
        style={{ padding: 30 }}
      >
        <div
          tw="flex flex-col"
          style={{
            fontSize: 80,
            gap: 25,
            lineHeight: 1,
            padding: 10,
            fontWeight: 600,
          }}
        >
          <div tw="flex">Now it&apos;s a party!</div>
          <PartyText text="GIVE Delivered" />
        </div>
        <div style={{ fontSize: 60, opacity: 0.9, display: 'flex' }}>
          Want to give @{username} more?
        </div>
        <FramePersonaHeadline
          avatar={viewerProfile?.avatar}
          giverTotalGiven={giverTotalGiven}
          receiverTotalReceived={receiverTotalReceived}
          giveAvailable={give}
          level={level.toString()}
        />
      </div>
    </FrameWrapper>
  );
};

export const JoinedSurprisePartyFrame: Frame = {
  id: 'joined.surprise.party',
  aspectRatio: '1.91:1',
  homeFrame: false,
  imageNode: imageNode,
  noCache: true,
  resourceIdentifier: usernameResourceIdentifier,
  clickURL: 'https://give.party',
  inputText: () => {
    return `Enter a skill`;
  },
  buttons: [
    {
      title: 'Send GIVE 🎁',
      action: 'post',
      onPost: async (info, params) => {
        return onSendSurpriseGIVEPost(info, params);
      },
    },
    {
      title: 'How 2 Party?',
      action: 'post',
      onPost: async () => SurprisePartyHelpFrame(),
    },
    // TODO: what is the leaderboard equiv here? we don't have skill available
    // {
    //   title: 'Leaderboard',
    //   action: 'post',
    //   onPost: async (_info, params) => {
    //     return SkillLeaderboardFrame(params.skill);
    //   },
    // },
    // TODO: profile frame is address based, we don't have address here
    // {
    //   title: 'Profile',
    //   action: 'post',
    //   onPost: async (_info, params) => {
    //     return ProfileFrame
    //   },
    // },
  ],
};
