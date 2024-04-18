import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { PartyHelpFrame } from '../giveparty/PartyHelpFrame.tsx';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FramePersonaHeadline } from '../layoutFragments/FramePersonaHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { TRY_GIVEBOT_INTENT } from '../routingUrls.ts';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);
  const {
    numGiveSent: giverTotalGiven,
    numGiveReceived: receiverTotalReceived,
  } = await fetchProfileInfo(viewerProfile?.id);
  const { give } = await fetchPoints(viewerProfile?.id);

  // TODO: Show how many GIVE left to level up
  return (
    <FrameWrapper>
      <FrameBgImage src="persona-2.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #0DC0E7 0%, #7908D2 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <FramePersonaHeadline
            avatar={viewerProfile?.avatar}
            giverTotalGiven={giverTotalGiven}
            receiverTotalReceived={receiverTotalReceived}
            giveAvailable={give}
            level="2"
          />
        </FrameHeadline>
        <FrameFooter>
          Send 5 GIVE
          <br />
          to level up more.
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const PersonaTwoFrame: Frame = {
  id: 'persona2',
  homeFrame: false,
  imageNode: imageNode,
  noCache: true,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Try @givebot',
      action: 'link',
      target: TRY_GIVEBOT_INTENT,
    },
    {
      title: 'How 2 Party?',
      action: 'post',
      onPost: async () => PartyHelpFrame(),
    },
  ],
};
