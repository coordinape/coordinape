import React, { useState } from 'react';

import { Flex, HR, Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';
import { MessageHeartOutline } from 'icons/__generated';

import { LearnCard, contentStyles } from './LearnCard';

export const GiveBotCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        image="/imgs/background/givebot.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
            justifyContent: 'space-between',
            background:
              'radial-gradient(circle at 25% 0%, rgb(143 80 0 / 53%) 10%, rgb(3 46 100 / 53%) 100%)',
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
            <MessageHeartOutline size="2xl" fa />
            <Text size="large" semibold css={{ textAlign: 'center' }}>
              Try @givebot
            </Text>
          </Flex>
          <Flex
            column
            css={{
              alignItems: 'center',
              gap: '$sm',
              background:
                'radial-gradient(circle at 25% 0%, rgb(154 68 0) 10%, rgb(0 57 128) 100%)',
              p: '$sm',
              width: '100%',
            }}
          >
            <Text size="small" css={{ textAlign: 'center' }}>
              You can easily GIVE to anyone <br /> on Farcaster with @givebot
            </Text>
          </Flex>
        </Flex>
      </LearnCard>
      {modalVisible && (
        <DrawerModal
          closeButtonStyles={{ color: '$white80' }}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <GiveBotModalContents />
        </DrawerModal>
      )}
    </>
  );
};

const codeStyle = {
  color: '$link',
  background: '$surface',
  fontFamily: 'monospace',
  fontWeight: '$semibold',
  whiteSpace: 'nowrap',
  px: '$xs',
  borderRadius: '$1',
};

const GiveBotModalContents = () => {
  return (
    <Flex column>
      <Flex
        css={{
          flexGrow: 1,
          width: '100%',
          minHeight: '280px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 30%',
          backgroundSize: 'cover',
          backgroundImage: "url('/imgs/background/givebot.jpg')",
          '@sm': {
            minHeight: '200px',
          },
        }}
      />

      <Flex
        column
        css={{
          p: '$lg',
          gap: '$md',
        }}
      >
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
          <Text h2>GIVE with a skill attestation</Text>
        </Flex>
        <Text inline>
          Simply reply cast{' '}
          <Text inline css={{ ...codeStyle }}>{`@givebot {#skill}`}</Text>{' '}
          replacing <Text inline css={{ ...codeStyle }}>{`"{#skill}"`}</Text>{' '}
          with the skill you want to attest to.
        </Text>
        <img
          src={'/imgs/background/givebot-learn-1.png'}
          alt="learn about givebot 1"
        />
        <Text>The @givebot will deliver</Text>
        <img
          src={'/imgs/background/givebot-learn-2.png'}
          alt="learn about givebot 2"
        />
        <HR />
        <Flex column css={{ gap: '$xs' }}>
          <Text variant={'label'}>OPTION 2</Text>
          <Text h2>Just GIVE (with no skill attestation)</Text>
        </Flex>
        <Text inline>
          Simply reply cast{' '}
          <Text inline css={{ ...codeStyle }}>{`@givebot`}</Text> to a cast.
        </Text>
        <img
          src={'/imgs/background/givebot-learn-3.png'}
          alt="learn about givebot 3"
        />
        <Text>The @givebot will deliver</Text>
        <img
          src={'/imgs/background/givebot-learn-4.png'}
          alt="learn about givebot 4"
        />
        <HR />
        <Flex column css={{ gap: '$xs' }}>
          <Text variant={'label'}>OPTION 3</Text>
          <Text h2>GIVE with a new cast</Text>
        </Flex>
        <Text inline>
          Simply invoke @givebot with this format:{' '}
          <Text
            inline
            css={{ ...codeStyle }}
          >{`@givebot @username #skilltag`}</Text>{' '}
          (#skilltag is optional).
        </Text>
        <img
          src={'/imgs/background/givebot-learn-5.png'}
          alt="learn about givebot 5"
        />
        <Text>The @givebot will deliver</Text>
        <img
          src={'/imgs/background/givebot-learn-6.png'}
          alt="learn about givebot 6"
        />
        <HR />
        <Text semibold>
          @givebot makes GIVEing in Farcaster and Warpcast E-A-S-Y!
        </Text>
      </Flex>
    </Flex>
  );
};
