import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
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

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #8C1EFF 30%, #FF1FFF 100%)',
        }}
      />
      <div
        tw="flex flex-col h-full w-full items-start justify-between"
        style={{ padding: 30, gap: 30 }}
      >
        <div
          tw="w-full h-full flex flex-col"
          style={{
            padding: '20px 32px',
            fontSize: 80,
          }}
        >
          Now it&apos;s a party!
          <br />
          You gave a GIVE to <PartyText text={`[@user]`} />
        </div>
        <FramePersonaHeadline
          avatar={viewerProfile?.avatar}
          giverTotalGiven={giverTotalGiven}
          receiverTotalReceived={receiverTotalReceived}
          level="0"
        />
      </div>
    </FrameWrapper>
  );
};

// TODO: this needs design
export const JoinedPartyFrame: Frame = {
  id: 'joined.party',
  aspectRatio: '1.91:1',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: skillResourceIdentifier,
  inputText: () => {
    return `Enter a Farcaster @username`;
  },
  buttons: [
    {
      title: 'How do I Start a Party?',
      action: 'post',
      onPost: async () => PartyHelpFrame,
    },
    {
      title: 'Send Give',
      action: 'post',
      onPost: async (info, params) => {
        return onSendGIVEPost(info, params);
        // return GivePartyHomeFrame('');
      },
    },
  ],
};
