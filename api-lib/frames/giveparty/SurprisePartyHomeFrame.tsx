import React from 'react';

import { ErrorFrameImage } from '../ErrorFrame.tsx';
import { Frame, ResourceIdentifierWithParams } from '../frames.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { validateAndCleanUsername } from './checkAndInsertGive.ts';
import { getSurpriseContextFromParams } from './getSurpriseContextFromParams.ts';
import { getRandomColor, gradientArray } from './JoinedPartyFrame.tsx';
import { onSendSurpriseGIVEPost } from './onSendSurpriseGIVEPost.tsx';
import { usernameResourceIdentifier } from './usernameResourceIdentifier.ts';

const givePartyImageNode = async (params: Record<string, string>) => {
  let { username } = await getSurpriseContextFromParams(params);
  const { error_message } = params;

  const randomGradient = getRandomColor(gradientArray);

  try {
    username = validateAndCleanUsername(username);
  } catch (e: any) {
    return ErrorFrameImage({ error_message: 'Invalid username: ' + e.message });
  }

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background: randomGradient,
        }}
      />
      <div
        tw="flex flex-col h-full justify-between"
        style={{ fontSize: 80, fontWeight: 600, padding: '50px 40px' }}
      >
        <div
          tw="flex flex-col overflow-x-auto"
          style={{ gap: 20, lineHeight: 1 }}
        >
          <div tw="flex">{`It's a GIVE Party for`}</div>
          <div tw="flex flex-row" style={{ gap: 36 }}>
            <PartyText text={`@${username}`} />
            {/*<PartyText text={`!!!`} />*/}
          </div>
          <div
            tw="flex"
            style={{
              marginTop: 10,
              fontSize: 54,
              fontWeight: 400,
              lineHeight: 1.5,
              gap: '0.3em',
            }}
          >
            <span style={{ opacity: 0.85 }}>Send them</span>
            <span style={{ fontWeight: 600 }}>GIVE</span>
            <span style={{ opacity: 0.85 }}>
              for the skills you appreciate!
            </span>
          </div>
        </div>

        {error_message && (
          <div
            tw="flex w-full text-center justify-center"
            style={{
              background: '#FF5FFF',
              color: 'black',
              padding: 10,
              fontSize: 40,
            }}
          >
            {error_message}
          </div>
        )}
        <div tw="flex justify-between">
          <div
            tw="flex"
            style={{ fontWeight: 400, fontSize: 40, maxWidth: '50%' }}
          >
            Enter a skill below, we&apos;ll send them a GIVE on your behalf
          </div>
          <div
            tw="flex items-center"
            style={{ fontSize: 70, fontWeight: 400, gap: 20 }}
          >
            <span>give.party</span>
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 90, height: 90 }}
            />
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

export const SurprisePartyHomeFrame = (
  errorMessage?: string,
  username?: string
): Frame => ({
  id: 'surprise.party',
  aspectRatio: '1.91:1',
  homeFrame: true,
  resourceIdentifier: ResourceIdentifierWithParams(
    usernameResourceIdentifier,
    username
      ? {
          username,
        }
      : {}
  ),
  errorMessage: errorMessage,
  clickURL: 'https://give.party',
  imageNode: givePartyImageNode,
  inputText: () => {
    return `Enter skill (based, design, etc)`;
  },
  buttons: [
    {
      title: 'Send GIVE 🎁',
      action: 'post',
      onPost: onSendSurpriseGIVEPost,
    },
  ],
});
