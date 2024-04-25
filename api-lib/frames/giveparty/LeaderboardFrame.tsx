/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { getSkillLeaderboardFromParams } from '../getSkillLeaderboardFromParams.ts';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

const ImageNode = async (params: Record<string, string>) => {
  const skill = 'project-management';
  const { leaderboard } = await getSkillLeaderboardFromParams(params);
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
        }}
      />
      <div tw="flex items-center h-full">
        <div
          tw="w-full flex flex-col"
          style={{
            padding: '20px 32px',
            fontSize: 55,
            fontWeight: 600,
            gap: 5,
          }}
        >
          <div
            tw="flex flex-col justify-center items-center text-center"
            style={{ gap: 2 }}
          >
            <span style={{ fontSize: 65, lineHeight: 1 }}>give.party</span>
            <PartyText text={`#${skill}`} fontSize={70} />
            <span style={{ fontSize: 65, lineHeight: 1 }}>leaderboard</span>
          </div>
          <div tw="flex flex-col" style={{ gap: 30, marginTop: 40 }}>
            {leaderboard &&
              leaderboard.map(member => (
                <>
                  <div tw="flex justify-between w-full items-center">
                    <div tw="flex" style={{ gap: 30 }}>
                      <OGAvatar avatar={member.target_profile_public?.avatar} />
                      <span>{member.target_profile_public?.name}</span>
                    </div>
                    <div tw="flex" style={{ fontSize: 48, gap: 8 }}>
                      {member.gives}{' '}
                      <span style={{ fontWeight: 300 }}>GIVE</span>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

export const LeaderboardFrame: Frame = {
  id: 'leaderboard',
  homeFrame: true,
  imageNode: ImageNode,
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
