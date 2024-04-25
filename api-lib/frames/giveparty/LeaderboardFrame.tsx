/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { HelpFrame } from '../HelpFrame.tsx';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

const imageNode = async (params: Record<string, string>) => {
  // TODO: load data for leaderboard
  // const { viewerProfile } = await getViewerFromParams(params);
  // const {
  //   numGiveSent: giverTotalGiven,
  //   numGiveReceived: receiverTotalReceived,
  // } = await fetchProfileInfo(viewerProfile?.id);
  // const { give } = await fetchPoints(viewerProfile?.id);

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
        <FrameHeadline>LEADERBOARD</FrameHeadline>
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
            Welcome
            <br />
            Get started by sending one of your 15 GIVE.
          </div>
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const LeaderboardFrame: Frame = {
  id: 'leaderboard',
  homeFrame: true,
  imageNode: imageNode,
  noCache: true,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'View Leaderboard',
      action: 'link',
      target: webAppURL('colinks') + '/giveboard',
    },
  ],
};
