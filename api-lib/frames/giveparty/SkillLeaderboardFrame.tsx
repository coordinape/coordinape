/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import {
  Frame,
  ResourceIdentifierWithParams,
} from '../../../_api/frames/router.tsx';
import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { getSkillLeaderboardFromParams } from '../getSkillLeaderboardFromParams.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { GivePartyHomeFrame } from './GivePartyHomeFrame.tsx';
import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const ImageNode = async (params: Record<string, string>) => {
  const { skill } = params;
  const { leaderboard } = await getSkillLeaderboardFromParams(skill);
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
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70 }}
            />
            <span
              style={{
                fontSize: 70,
                lineHeight: 1,
                fontWeight: 400,
                marginBottom: 20,
              }}
            >
              give.party
            </span>
            <PartyText text={`#${skill}`} fontSize={70} />
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

export const SkillLeaderboardFrame = (skill?: string): Frame => {
  return {
    id: 'skill.leaderboard',
    homeFrame: true,
    imageNode: ImageNode,
    noCache: true,
    resourceIdentifier: ResourceIdentifierWithParams(
      skillResourceIdentifier,
      skill ? { skill } : {}
    ),
    buttons: [
      {
        title: 'GIVE',
        action: 'post',
        onPost: async (_info, params) => {
          return GivePartyHomeFrame(undefined, params.skill);
        },
      },
      {
        title: 'Full Leaderboard',
        action: 'link',
        target: params =>
          webAppURL('colinks') +
          '/giveboard/' +
          encodeURIComponent(params.skill),
      },
    ],
  };
};
