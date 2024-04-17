import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FramePersonaHeadline } from '../layoutFragments/FramePersonaHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

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
      <FrameBgImage src="margaritas.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #135A95 0%, #092031 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <FramePersonaHeadline
            avatar={viewerProfile?.avatar}
            giverTotalGiven={giverTotalGiven}
            receiverTotalReceived={receiverTotalReceived}
            level="0"
          />
        </FrameHeadline>
        <FrameFooter>
          {' '}
          <div
            tw="w-full flex flex-col text-center justify-center items-center"
            style={{
              height: 230,
              padding: '20px 32px',
              fontSize: 46,
            }}
          >
            Cool nice GIVE!
            <br />
            Uhhhhhhhhh something else now
          </div>
        </FrameFooter>
      </FrameBody>
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
