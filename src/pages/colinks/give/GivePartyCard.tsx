import React, { useState } from 'react';

import { DrawerModal } from '../../../ui/DrawerModal';
import { Party } from 'icons/__generated';
import { HowToParty } from 'pages/HowToParty';
import { Flex, Text } from 'ui';

import { LearnCard, contentStyles } from './LearnCard';

export const GivePartyCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LearnCard
        image="/imgs/background/giveparty-dance.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
            justifyContent: 'space-between',
            background:
              'radial-gradient(circle at 25% 0%, #5507E788 20%, #E7A60788 100%)',
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
            <Party size="2xl" fa css={{ rotate: '-10deg' }} />
            <Text size="large" semibold css={{ textAlign: 'center' }}>
              Start a GIVE Party
            </Text>
          </Flex>
          <Flex
            column
            css={{
              alignItems: 'center',
              gap: '$sm',
              background:
                'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
              p: '$sm',
              width: '100%',
            }}
          >
            <Text size="small" css={{ textAlign: 'center' }}>
              Celebrate someone or a skill <br />
              that you care about
            </Text>
          </Flex>
        </Flex>
      </LearnCard>
      {modalVisible && (
        <DrawerModal
          visible={modalVisible}
          closeButtonStyles={{ color: '$white80' }}
          onClose={() => setModalVisible(false)}
        >
          <Flex
            css={{
              flexGrow: 1,
              width: '100%',
              minHeight: '280px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 35%',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/giveparty-dance.jpg')",
              '@sm': {
                minHeight: '200px',
              },
            }}
          />
          <HowToParty />
        </DrawerModal>
      )}
    </>
  );
};
