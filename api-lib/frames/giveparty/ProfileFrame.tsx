import React from 'react';

import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { ErrorFrameImage } from '../ErrorFrame';
import { Button, Frame, ResourceIdentifierWithParams } from '../frames.ts';
import {
  fetchCoLinksProfile,
  fetchProfileInfo,
  PublicProfile,
} from '../give/fetchProfileInfo.tsx';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

import { addressResourceIdentifier } from './addressResourceIdentifier.ts';

const ImageNode = async (params: Record<string, string>) => {
  const { address } = params;
  const data = await fetchCoLinksProfile(address!);

  if (!data) {
    return ErrorFrameImage({ error_message: 'No Coordinape profile exists' });
  }

  const targetProfile = data as PublicProfile;
  const { numGiveSent, numGiveReceived, topSkills } = await fetchProfileInfo(
    targetProfile?.id
  );
  // const { give } = await fetchPoints(viewerProfile?.id);
  const statIconSize = 50;
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #FFA800 100%)',
        }}
      />
      <div tw="flex items-center h-full">
        <div
          tw="w-full flex flex-col items-center justify-center"
          style={{
            padding: '20px 32px',
            fontWeight: 600,
            fontSize: 42,
          }}
        >
          <OGAvatar avatar={targetProfile.avatar} size={150} />
          <span style={{ fontSize: 65 }}>{targetProfile.name}</span>
          <div
            tw="flex flex-col items-center justify-center"
            style={{
              borderTop: '1px solid #ffffff44',
              borderBottom: '1px solid #ffffff44',
              padding: '30px 50px',
              margin: '10px 0 40px',
              gap: 15,
            }}
          >
            <div tw="flex" style={{ gap: 50 }}>
              <div tw="flex items-center" style={{ gap: 15 }}>
                <span>{targetProfile.reputation_score.total_score}</span>
                <img
                  alt="gem"
                  src={IMAGE_URL_BASE + 'certificate.png'}
                  style={{ width: statIconSize, height: statIconSize }}
                />
                <span style={{ fontWeight: 400 }}>Rep</span>
              </div>
              <div tw="flex items-center" style={{ gap: 15 }}>
                <span>{targetProfile.links}</span>
                <img
                  alt="gem"
                  src={IMAGE_URL_BASE + 'links.png'}
                  style={{ width: statIconSize, height: statIconSize }}
                />
                <span style={{ fontWeight: 400 }}>CoLinks</span>
              </div>
            </div>
            <div tw="flex" style={{ gap: 50 }}>
              <div tw="flex items-center" style={{ gap: 15 }}>
                <span>{numGiveReceived}</span>
                <img
                  alt="gem"
                  src={IMAGE_URL_BASE + 'GemWhite.png'}
                  style={{ width: statIconSize, height: statIconSize }}
                />
                <span style={{ fontWeight: 400 }}>GIVE Received</span>
              </div>
              <div tw="flex items-center" style={{ gap: 15 }}>
                <span>{numGiveSent}</span>
                <img
                  alt="gem"
                  src={IMAGE_URL_BASE + 'GemWhite.png'}
                  style={{ width: statIconSize, height: statIconSize }}
                />
                <span style={{ fontWeight: 400 }}>GIVE Sent</span>
              </div>
            </div>
          </div>

          <div
            tw="flex flex-col justify-between items-center justify-center"
            style={{
              gap: 20,
            }}
          >
            {topSkills.map(skill => (
              <div
                key={skill.skill}
                // tw="flex items-center"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 15,
                  background: '#419E77cc',
                  borderRadius: 10,
                  padding: '3px 12px',
                }}
              >
                <span style={{ fontWeight: 400 }}>+{skill.gives}</span>
                <img
                  alt="gem"
                  src={IMAGE_URL_BASE + 'GemWhite.png'}
                  style={{ width: statIconSize, height: statIconSize }}
                />
                <span
                  style={{
                    maxWidth: '600px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {skill.skill}
                </span>
              </div>
            ))}
          </div>
          <div
            tw="flex justify-center items-center text-center"
            style={{ gap: 10, marginTop: 30 }}
          >
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 55, height: 55 }}
            />
            <span
              style={{
                fontSize: 55,
                lineHeight: 1,
                fontWeight: 400,
                marginBottom: 10,
              }}
            >
              give.party
            </span>
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

// TODO: i had to make these functions because the params weren't updating properly? i dont get it -g
const castButton = (address: string): Button => ({
  title: '🔊 Cast My Profile',
  action: 'link',
  target: () => {
    const msg = `Check out my @coordinape GIVE profile 👀
It shows GIVE activity, top skills, and onchain Rep.
Grab yours in this handy frame  👇🏼`;
    return `https://warpcast.com/~/compose?text=${encodeURIComponent(msg)}&embeds[]=${webAppURL('colinks')}/${encodeURIComponent(address)}`;
  },
});

// TODO: i had to make these functions because the params weren't updating properly? i dont get it -g
const myProfileButton: Button = {
  title: 'Show My Profile',
  action: 'post',
  onPost: async info => {
    return ProfileFrame(info.profile.address, true);
  },
};

export const ProfileFrame = (address?: string, showMe?: boolean): Frame => {
  return {
    id: 'giveparty.profile',
    homeFrame: true,
    imageNode: ImageNode,
    noCache: true,
    resourceIdentifier: ResourceIdentifierWithParams(
      addressResourceIdentifier,
      address ? { address } : {}
    ),
    buttons: [
      ...(showMe && address ? [castButton(address)] : [myProfileButton]),
      {
        title: 'Full Profile',
        action: 'link',
        target: params =>
          webAppURL('colinks') +
          '/' +
          encodeURIComponent(address ?? params.address),
      },
    ],
  };
};
