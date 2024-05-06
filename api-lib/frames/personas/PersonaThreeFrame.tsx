import React from 'react';

import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { coLinksPaths } from '../../../src/routes/paths.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { Frame } from '../frames.ts';
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
  const { give } = await fetchPoints(viewerProfile?.id);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-3.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #3300FF 0%, #EF7200 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <FramePersonaHeadline
            avatar={viewerProfile?.avatar}
            giverTotalGiven={giverTotalGiven}
            receiverTotalReceived={receiverTotalReceived}
            giveAvailable={give}
            level="3"
          />
        </FrameHeadline>
        <FrameFooter>
          Join CoLinks
          <br />
          to level up again.
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const PersonaThreeFrame: Frame = {
  id: 'persona3',
  homeFrame: false,
  noCache: true,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Join CoLinks',
      action: 'link',
      target: webAppURL('colinks') + coLinksPaths.wizardStart,
    },
  ],
};
