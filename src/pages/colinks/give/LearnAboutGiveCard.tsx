import React, { useContext, useState } from 'react';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { MAX_GIVE } from 'features/points/getAvailablePoints';
import { PointsBar } from 'features/points/PointsBar';
import { usePoints } from 'features/points/usePoints';

import { Button, Flex, Link, Panel, Text } from '../../../ui';
import { DrawerModal } from '../../../ui/DrawerModal';
import { GemCoOutline } from 'icons/__generated';
import {
  EXTERNAL_URL_DOCS_SOCIAL_ORACLE,
  EXTERNAL_URL_SOCIAL_ORACLE_SCHEMA,
} from 'routes/paths';

import { LearnCard, contentStyles } from './LearnCard';

export const LearnAboutGiveCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { address } = useContext(CoLinksContext);
  const { give } = usePoints();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  return (
    <>
      <LearnCard
        image="/imgs/background/colink-give.jpg"
        onClick={() => setModalVisible(true)}
      >
        <Flex
          column
          css={{
            ...contentStyles,
            justifyContent: 'space-between',
            background:
              'radial-gradient(circle at 25% 0%, rgb(7 202 103 / 66%) 20%, rgb(90 5 192 / 66%) 100%)',
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
            <GemCoOutline size="2xl" fa />
            <Text size="large" semibold css={{ textAlign: 'center' }}>
              What is GIVE?
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
              backgroundPosition: '50% 30%',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/colink-give.jpg')",
              '@sm': {
                minHeight: '200px',
              },
            }}
          />
          <Flex column css={{ p: '$lg', gap: '$md' }}>
            <Text h2 display>
              <GemCoOutline fa size="xl" css={{ mr: '$sm' }} />
              GIVE
            </Text>
            <Text h1 inline>
              A simple and powerful onchain way to recognize people and their
              impact
              <Text inline>
                , inside and outside of the Coordinape platform.
              </Text>
            </Text>
            <Text>
              Everyone gets GIVE emitted to them daily, which they can send to
              others to level up their Skills. See your GIVE supply in the GIVE
              bar here in the app.{' '}
            </Text>
            <Flex
              column
              css={{
                gap: '$sm',
                flexGrow: 1,
                width: '100%',
                maxWidth: 340,
                margin: 'auto',
                alignItems: 'center',
              }}
            >
              <Panel noBorder css={{ width: '100%' }}>
                <Flex css={{ justifyContent: 'space-between' }}>
                  <Flex>
                    <Text semibold size="small">
                      GIVE Bar
                    </Text>
                  </Flex>
                  <Text size="small" semibold color="link">
                    {address ? give : MAX_GIVE}
                    <GemCoOutline fa css={{ ml: '$xs' }} />
                  </Text>
                </Flex>
                <PointsBar barOnly demo={!address} />
              </Panel>
              {!address && (
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    if (openConnectModal && !connectModalOpen)
                      openConnectModal();
                  }}
                  disabled={connectModalOpen}
                  color="cta"
                  css={{}}
                >
                  Login To Get {MAX_GIVE} GIVE
                </Button>
              )}
            </Flex>
            <Text inline>
              All GIVE is automatically minted via an{' '}
              <Link
                inlineLink
                href={EXTERNAL_URL_SOCIAL_ORACLE_SCHEMA}
                target="_blank"
              >
                EAS schema on Base
              </Link>{' '}
              when given, which is portable and interoperable. We call it{' '}
              <Link
                inlineLink
                href={EXTERNAL_URL_DOCS_SOCIAL_ORACLE}
                target="_blank"
              >
                The Social Oracle
              </Link>
              .
            </Text>
            <Text>
              You can give GIVE to anyone on Farcaster or Coordinape to
              recognize them.
            </Text>
            <Text>
              GIVE creates Trust Graphs that are the best way to discover
              people, content and connections in web3.
            </Text>
          </Flex>
        </DrawerModal>
      )}
    </>
  );
};
