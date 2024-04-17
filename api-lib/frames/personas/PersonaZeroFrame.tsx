import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { HelpFrame } from '../HelpFrame.tsx';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FramePersonaHeadline } from '../layoutFragments/FramePersonaHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);
  const {
    numGiveSent: giverTotalGiven,
    numGiveReceived: receiverTotalReceived,
  } = await fetchProfileInfo(viewerProfile?.id);
  const { give } = await fetchPoints(viewerProfile?.id);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-0.jpg" />
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
            giveAvailable={give}
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
            Welcome, {viewerProfile?.name}!
            <br />
            Get started by sending one of your 15 GIVE.
          </div>
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const PersonaZeroFrame: Frame = {
  id: 'persona0',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'How do I GIVE?',
      action: 'post',
      onPost: async () => HelpFrame,
    },
  ],
};
