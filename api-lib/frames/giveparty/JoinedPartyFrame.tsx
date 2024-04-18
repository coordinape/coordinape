import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FramePersonaHeadline } from '../layoutFragments/FramePersonaHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { onSendGIVEPost } from './onSendGIVEPost.tsx';
import { PartyHelpFrame } from './PartyHelpFrame.tsx';
import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);
  const {
    numGiveSent: giverTotalGiven,
    numGiveReceived: receiverTotalReceived,
  } = await fetchProfileInfo(viewerProfile?.id);
  const { give } = await fetchPoints(viewerProfile?.id);

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #8C1EFF 30%, #FF1FFF 100%)',
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
        <div style={{ fontSize: 60, opacity: 0.9 }}>Want to give more?</div>
        <FramePersonaHeadline
          avatar={viewerProfile?.avatar}
          giverTotalGiven={giverTotalGiven}
          receiverTotalReceived={receiverTotalReceived}
          giveAvailable={give}
          level="0"
        />
      </div>
    </FrameWrapper>
  );
};

export const JoinedPartyFrame: Frame = {
  id: 'joined.party',
  aspectRatio: '1.91:1',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: skillResourceIdentifier,
  clickURL: 'https://give.party',
  inputText: () => {
    return `Enter a Farcaster @username`;
  },
  buttons: [
    {
      title: 'Send GIVE 🎁',
      action: 'post',
      onPost: async (info, params) => {
        return onSendGIVEPost(info, params);
        // return GivePartyHomeFrame('');
      },
    },
    {
      title: 'How 2 Party?',
      action: 'post',
      onPost: async () => PartyHelpFrame(),
    },
  ],
};
