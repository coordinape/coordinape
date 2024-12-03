import React, { useState } from 'react';

import copy from 'copy-to-clipboard';
import { skillTextStyle } from 'stitches.config';

import { Button, Flex, Link, Text, HR } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';
import { useToast } from 'hooks';
import {
  Copy,
  FarcasterActions,
  GemCoOutline,
  MessageHeartOutline,
  ShareGive,
  Wand,
} from 'icons/__generated';
import { PartyDisplayText } from 'ui/Tooltip/PartyDisplayText';

import { codeStyle } from './GiveBotCard';
import { LearnCard, contentStyles } from './LearnCard';

export const ShareGiveCard = ({ skill }: { skill?: string }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <LearnCard
        image="/imgs/background/give-share.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
            justifyContent: 'space-between',
            background:
              'radial-gradient(circle at 25% 0%, rgb(172 116 20 / 50%) 20%, rgba(32, 5, 64, 0.11) 100%)',
          }}
        >
          <Flex
            column
            css={{
              alignItems: 'center',
              gap: '$sm',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            <ShareGive size="2xl" fa />
            <Flex
              css={{
                columnGap: '$sm',
                flexWrap: 'wrap',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                size="large"
                semibold
                css={{
                  whiteSpace: 'nowrap',
                }}
              >
                Share{' '}
              </Text>
              <Text
                size="large"
                semibold
                css={{
                  ...skillTextStyle,
                  maxWidth: '16rem',
                  textTransform: 'capitalize',
                }}
              >
                {skill}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </LearnCard>
      {modalVisible && (
        <DrawerModal
          visible={modalVisible}
          closeButtonStyles={{ color: '$white80' }}
          onClose={() => setModalVisible(false)}
        >
          <ShareGiveContent skill={skill} />
        </DrawerModal>
      )}
    </>
  );
};

export const ShareGiveContent = ({ skill }: { skill?: string }) => {
  const startPartyUrl = `https://warpcast.com/~/compose?text=https://give.party/${skill}&embeds[]=https://give.party/${skill}`;
  const farcasterActionUrl = `https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fcoordinape.com%2Fapi%2Ffarcaster%2Factions%2Fgive%2F${skill}`;
  const { showDefault } = useToast();
  const copyToClip = () => {
    copy(`https://give.party/${skill}`);
    showDefault(`Copied URL to clipboard`, {
      toastId: 'copyCode',
      updateId: 'copyCode',
    });
  };
  return (
    <>
      <Flex
        css={{
          flexGrow: 1,
          width: '100%',
          minHeight: '280px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 30%',
          backgroundSize: 'cover',
          backgroundImage: "url('/imgs/background/give-share.jpg')",

          '@sm': {
            minHeight: '200px',
          },
        }}
      />
      <Flex column css={{ p: '$lg', gap: '$md' }}>
        <Text h2 display>
          <GemCoOutline fa size="xl" css={{ mr: '$sm' }} />
        </Text>
        <Text inline h2 display>
          Start a{' '}
          <Text h2 display inline>
            {skill}
          </Text>{' '}
          GIVE party
        </Text>
        <Flex
          column
          css={{
            width: '100%',
            aspectRatio: '2 / .7',
            borderRadius: 10,
            color: 'white',
            p: '$md',
            background:
              'radial-gradient(circle at 25% 0%, #7516BF 30%, #00AEF9 100%)',
            justifyContent: 'space-between',
            // outline: '8px solid rgba(0,0,0,0.4)',
            '@sm': {
              minHeight: '240px',
            },
          }}
        >
          <Flex column style={{ gap: 5 }}>
            <Text
              semibold
              css={{
                fontSize: 36,
                '@sm': {
                  fontSize: 30,
                },
              }}
            >
              Who is{skill === 'based' ? '' : ' great at'}
            </Text>
            <Text
              semibold
              css={{
                fontSize: 36,
                '@sm': {
                  fontSize: 30,
                },
              }}
            >
              <PartyDisplayText text={`#${skill}`} />
            </Text>
            <Text
              semibold
              css={{
                fontSize: 36,
                '@sm': {
                  fontSize: 30,
                },
              }}
            >
              on Farcaster
            </Text>
          </Flex>
          <Flex
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <Flex
              css={{
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Text
                css={{
                  fontSize: 32,
                  '@sm': {
                    fontSize: 28,
                  },
                }}
              >
                give.party
              </Text>
              <GemCoOutline size="xl" fa />
            </Flex>
          </Flex>
        </Flex>
        <Flex css={{ mt: '-$sm', gap: '$md' }}>
          <Button
            as={Link}
            href={startPartyUrl}
            target="_blank"
            rel="noreferrer"
            color="cta"
          >
            <Wand fa size={'md'} /> Cast in Farcaster
          </Button>
          <Button color="cta" onClick={copyToClip}>
            <Copy size={'md'} /> Copy URL
          </Button>
        </Flex>
        <Flex
          column
          css={{ borderTop: '1px solid #00000033', pt: '$xl', mt: '$md' }}
        >
          <Text h2> How does this work?</Text>
          <ul
            style={{
              padding: '0 1em',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              lineHeight: 1.2,
            }}
          >
            <li>Cast the URL to start a GIVE Party</li>
            <li>
              <strong>Skill Party</strong> - Celebrate a skill. Anyone on
              Farcaster can use the frame to name people who they think are
              awesome at that skill.
            </li>
            <li>
              Party Starters will get Coordinape Rep Points for their parties!
              Every party gets a little, really big parties get a lot.
            </li>
            <li>
              GIVE will be sent by Coordinape to create a map of this skill
              party.
            </li>
          </ul>
        </Flex>
        <HR />
        <Text h2 display>
          <MessageHeartOutline fa size="xl" css={{ mr: '$sm' }} />
        </Text>
        <Text h1 inline>
          You can easily GIVE to anyone on Farcaster with{' '}
          <Text inline css={{ ...codeStyle }}>
            @givebot
          </Text>
        </Text>
        <HR />
        <Flex column css={{ gap: '$xs' }}>
          <Text variant={'label'}>OPTION 1</Text>
          <Text h2>GIVE with a reply attestation</Text>
        </Flex>
        <Text inline>
          Simply reply cast{' '}
          <Text inline css={{ ...codeStyle }}>
            @givebot #{skill}
          </Text>
        </Text>
        <HR />
        <Flex column css={{ gap: '$xs' }}>
          <Text variant={'label'}>OPTION 2</Text>
          <Text h2>GIVE with a new cast attestation</Text>
        </Flex>
        <Text inline>
          Simply invoke @givebot with this format:{' '}
          <Text inline css={{ ...codeStyle }}>
            @givebot @username #{skill}
          </Text>
        </Text>
        <HR />
        <Text h2 display>
          <FarcasterActions fa size="xl" css={{ mr: '$sm' }} />
        </Text>
        <Text h1 inline>
          Add Farcaster action for{' '}
          <Text h1 inline css={{ ...codeStyle }}>
            {skill}
          </Text>
        </Text>
        <Flex css={{ alignItems: 'flex-start' }}>
          <Button
            as={Link}
            href={farcasterActionUrl}
            target="_blank"
            rel="noreferrer"
            color="cta"
          >
            <FarcasterActions fa size={'md'} /> Add Farcaster Action
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
