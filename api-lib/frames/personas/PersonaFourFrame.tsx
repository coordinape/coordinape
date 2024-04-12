import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { coLinksPaths } from '../../../src/routes/paths.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
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

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-4.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #E31A1A 0%, #790066 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <FramePersonaHeadline
            avatar={viewerProfile?.avatar}
            giverTotalGiven={giverTotalGiven}
            receiverTotalReceived={receiverTotalReceived}
            level="4"
          />
        </FrameHeadline>
        <FrameFooter>
          <div tw="flex flex-col items-center">
            Welcome to the inner circle!
            <span style={{ fontSize: 36, opacity: 0.8 }}>
              View all your stats at CoLinks.xyz
            </span>
          </div>
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const PersonaFourFrame: Frame = {
  id: 'persona4',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'View Leaderboard',
      action: 'link',
      target: webAppURL('colinks') + coLinksPaths.exploreMostGive,
    },
  ],
};
