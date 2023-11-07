import { useState } from 'react';

import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingModal } from '../../../components';
import { isFeatureEnabled } from '../../../config/features';
import { ActivityList } from '../../../features/activities/ActivityList';
import { BuyOrSellCoLinks } from '../../../features/colinks/BuyOrSellCoLinks';
import { CoLinksChainGate } from '../../../features/colinks/CoLinksChainGate';
import { CoLinksHeld } from '../../../features/colinks/CoLinksHeld';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { CoLinksHolders } from '../../../features/colinks/CoLinksHolders';
import { Poaps } from '../../../features/colinks/Poaps';
import { PostForm } from '../../../features/colinks/PostForm';
import { RightColumnSection } from '../../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../../features/colinks/useCoLinks';
import { CoSoulGate } from '../../../features/cosoul/CoSoulGate';
import { useToast } from '../../../hooks';
import { Clock } from '../../../icons/__generated';
import { client } from '../../../lib/gql/client';
import { paths } from '../../../routes/paths';
import {
  Avatar,
  Button,
  ContentHeader,
  Flex,
  Link,
  Panel,
  Text,
} from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

export const ViewProfilePageContents = ({
  subjectAddress,
}: {
  subjectAddress: string;
}) => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <CoLinksChainGate actionName="Use CoLinks">
      {(contracts, currentUserAddress, soulKeys) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use CoLinks'}
        >
          {() => (
            <PageContents
              soulKeys={soulKeys}
              chainId={contracts.chainId}
              currentUserAddress={currentUserAddress}
              subjectAddress={subjectAddress}
            />
          )}
        </CoSoulGate>
      )}
    </CoLinksChainGate>
  );
};

const PageContents = ({
  soulKeys,
  chainId,
  currentUserAddress,
  subjectAddress,
}: {
  soulKeys: SoulKeys;
  chainId: string;
  currentUserAddress: string;
  subjectAddress: string;
}) => {
  const { balance, subjectBalance, supply, superFriend } = useCoLinks({
    soulKeys,
    address: currentUserAddress,
    subject: subjectAddress,
  });
  const subjectIsCurrentUser =
    subjectAddress.toLowerCase() == currentUserAddress.toLowerCase();
  const [showLoading, setShowLoading] = useState(false);

  const [updatingRepScore, setUpdatingRepScore] = useState(false);
  const { showError } = useToast();

  const queryClient = useQueryClient();

  const updateRepScore = async () => {
    setUpdatingRepScore(true);
    try {
      await client.mutate(
        {
          updateRepScore: { success: true },
        },
        {
          operationName: 'updateMyRepScore',
        }
      );
      queryClient.invalidateQueries(['soulKeys', subjectAddress]);
    } catch (e) {
      showError(e);
    } finally {
      setUpdatingRepScore(false);
    }
  };

  const { data: subjectProfile } = useQuery(
    ['soulKeys', subjectAddress, 'profile'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: subjectAddress,
                },
              },
            },
            {
              id: true,
              name: true,
              avatar: true,
              reputation_score: {
                total_score: true,
              },
            },
          ],
        },
        {
          operationName: 'soulKeys_profile',
        }
      );
      return profiles_public.pop();
    }
  );

  const needsBootstrapping = subjectIsCurrentUser && balance == 0;

  if (!subjectProfile) {
    return <LoadingModal visible={true} />;
  }

  return (
    <SingleColumnLayout>
      <Flex css={{ gap: '$lg' }}>
        <Flex column css={{ gap: '$xl', flex: 2 }}>
          <ContentHeader>
            <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
              <Flex css={{ justifyContent: 'space-between' }}>
                <Flex alignItems="center" css={{ gap: '$sm' }}>
                  <Avatar
                    size="large"
                    name={subjectProfile.name}
                    path={subjectProfile.avatar}
                    margin="none"
                    css={{ mr: '$sm' }}
                  />
                  <Flex column>
                    <Text h2 display css={{ color: '$secondaryButtonText' }}>
                      {subjectProfile.name}
                    </Text>
                    {!needsBootstrapping && (
                      <Flex css={{ gap: '$sm', mt: '$xs' }}>
                        {!subjectIsCurrentUser && superFriend && (
                          <Text tag color={'alert'}>
                            You are superfriends!
                          </Text>
                        )}
                        <Text tag color={balance == 0 ? 'warning' : 'complete'}>
                          You own {balance} Key
                          {balance == 1 ? '' : 's'}
                        </Text>
                        <Text tag color="neutral">
                          {supply !== null && supply + ` Total Keys Issued`}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
                {subjectIsCurrentUser && (
                  <Flex column css={{ gap: '$sm', alignItems: 'center' }}>
                    <Text semibold size="small">
                      Rep Score
                    </Text>
                    <Link href={paths.soulKeysRepScore(subjectAddress)}>
                      <Text semibold h1>
                        {subjectProfile?.reputation_score?.total_score ?? ''}
                      </Text>
                    </Link>
                    <Flex>
                      <Button
                        disabled={updatingRepScore}
                        color="neutral"
                        onClick={updateRepScore}
                        size="xs"
                      >
                        Update Score
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Flex>
              {subjectIsCurrentUser &&
                subjectBalance !== undefined &&
                subjectBalance > 0 && (
                  <Flex css={{ maxWidth: '$readable' }}>
                    <PostForm
                      showLoading={showLoading}
                      onSave={() => setShowLoading(true)}
                    />
                  </Flex>
                )}
            </Flex>
          </ContentHeader>
          {balance !== undefined && balance > 0 && (
            <Flex column>
              <ActivityList
                queryKey={['soulkey_activity', subjectProfile.id]}
                onSettled={() => setShowLoading(false)}
                where={{
                  private_stream: { _eq: true },
                  actor_profile_id: { _eq: subjectProfile.id },
                }}
              />
            </Flex>
          )}
          {balance === 0 && subjectBalance !== undefined && (
            <NoBalancePanel
              subjectBalance={subjectBalance}
              me={subjectIsCurrentUser}
            />
          )}
        </Flex>
        <Flex column css={{ flex: 1, gap: '$lg', mr: '$xl' }}>
          <RightColumnSection>
            <Flex column css={{ width: '100%' }}>
              <BuyOrSellCoLinks
                subject={subjectAddress}
                address={currentUserAddress}
                soulKeys={soulKeys}
                chainId={chainId}
                hideName={true}
              />
              {needsBootstrapping && (
                <Panel info css={{ mt: '$lg', gap: '$md' }}>
                  <Text inline>
                    <strong>Buy your first Link</strong> to allow other CoLink
                    holders to buy your Link.
                  </Text>
                  <Text>
                    Your keyholders will gain access to X. You will receive Y%
                    of the price when they buy or sell.
                  </Text>
                  <Text>
                    <Link> Learn More about Links</Link>
                  </Text>
                </Panel>
              )}
            </Flex>
          </RightColumnSection>
          <CoLinksHolders subject={subjectAddress} />
          <CoLinksHeld address={subjectAddress} />
          <RightColumnSection
            title={
              <Flex>
                <Clock /> Recent Key Transactions
              </Flex>
            }
          >
            <CoLinksHistory subject={subjectAddress} />
          </RightColumnSection>
          <Poaps address={subjectAddress} />
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};

const NoBalancePanel = ({
  // balance,
  subjectBalance,
  me,
}: {
  // balance: number;
  subjectBalance: number;
  me: boolean;
}) => {
  return (
    <Panel info>
      <Flex column css={{ gap: '$md' }}>
        {me ? (
          <Flex column css={{ gap: '$md' }}>
            <Text size="xl" semibold>
              You need to buy your own key bro!!!
            </Text>
            <Text size="xl" semibold>
              Kinda embarassing that you don&apos;t have it tbh.
            </Text>
          </Flex>
        ) : (
          <>
            <Text size="xl" semibold>
              {`You need to buy this bro. You don't have their key yet.`}
              {subjectBalance === 0 &&
                `You can't see each other's activity because they don't have your key either`}
            </Text>
            <Text size="xl" semibold>
              {subjectBalance === 0
                ? `They don't own your keys`
                : `They already own your key!`}
            </Text>
          </>
        )}
      </Flex>
    </Panel>
  );
};
