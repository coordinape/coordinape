import { useState } from 'react';

import { useQuery } from 'react-query';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { LinkTxProgress } from '../../features/colinks/LinkTxProgress';
import { ScoreComponent } from '../../features/colinks/ScoreComponent';
import { INVITE_SCORE_PER_INVITE_WITH_COSOUL } from '../../features/rep/api/scoring';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import useProfileId from '../../hooks/useProfileId';
import { Check } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

import { coLinksMemberSelector } from './explore/CoLinksMember';
import { ProfileForCard } from './explore/fetchPeopleWithSkills';
import { SimpleBuyButtonWithPrice } from './explore/SimpleBuyButtonWithPrice';

const INVITES_QUERY_KEY = 'invites';

const fetchInvites = async (currentAddress: string, profileId: number) => {
  const { invite_codes, reputation_scores_by_pk } = await client.query(
    {
      reputation_scores_by_pk: [
        {
          profile_id: profileId,
        },
        {
          invite_score: true,
        },
      ],
      invite_codes: [
        {
          order_by: [
            { updated_at: order_by.desc_nulls_last },
            { code: order_by.asc },
          ],
        },
        {
          code: true,
          invited: coLinksMemberSelector(currentAddress),
        },
      ],
    },
    {
      operationName: 'getMyInvites',
    }
  );
  return {
    invite_codes,
    invite_score: reputation_scores_by_pk?.invite_score ?? 0,
  };
};

export const InvitesPage = () => {
  const address = useConnectedAddress(true);
  const profileId = useProfileId(true);

  const { data: invites } = useQuery([INVITES_QUERY_KEY], () =>
    fetchInvites(address, profileId)
  );

  const availableCodes = invites?.invite_codes?.filter(i => !i.invited);

  // TODO: this includes users who haven't bought their own link yet, which might be weird to click through to
  const usedCodes = invites?.invite_codes?.filter(i => !!i.invited);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex
          css={{
            justifyContent: 'space-between',
            flexGrow: 1,
            width: '100%',
          }}
        >
          <Flex column>
            <Text h2 display>
              Invite Codes
            </Text>
            <Text inline>
              Recruit new CoLinks members to boost your Rep Score
            </Text>
          </Flex>
          <ScoreComponent
            label={'Invite Score'}
            score={invites?.invite_score ?? 0}
            address={address}
          />
        </Flex>
      </ContentHeader>

      {availableCodes === undefined || usedCodes === undefined ? (
        <LoadingIndicator />
      ) : (
        <Flex css={{ width: '100%', gap: '$md' }}>
          <Flex column css={{ flex: 1, gap: '$md' }}>
            <Text h2>
              {usedCodes.length} Invited Member
              {usedCodes.length === 1 ? '' : 's'}
            </Text>

            {usedCodes.length === 0 ? (
              <Panel noBorder>
                <Text>{`You haven't had any invite signups yet.`}</Text>
              </Panel>
            ) : (
              <Flex column css={{ gap: '$md' }}>
                {usedCodes.map(
                  i =>
                    i.invited && (
                      <Invitee key={i.code} invited={i.invited} code={i.code} />
                    )
                )}
              </Flex>
            )}
          </Flex>

          <Flex column css={{ flex: 1, gap: '$md' }}>
            <Text h2>
              {availableCodes.length} Available Invite Code
              {availableCodes.length === 1 ? '' : 's'}
            </Text>
            {availableCodes.length === 0 ? (
              <Panel noBorder>
                <Text>{`You don't have any invite codes right now.`}</Text>
              </Panel>
            ) : (
              <Flex column css={{ gap: '$md' }}>
                <Panel css={{ maxWidth: '300px', gap: '$sm' }} noBorder>
                  {availableCodes.map(i => (
                    <Flex key={i.code}>
                      <CopyCodeTextField value={i.code} />
                    </Flex>
                  ))}
                </Panel>
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </SingleColumnLayout>
  );
};

const Invitee = ({
  invited,
  code,
}: {
  invited: ProfileForCard;
  code: string;
}) => {
  const [buyProgress, setBuyProgress] = useState('');

  const onBought = () => {
    setBuyProgress('');
  };

  return (
    <Panel
      as={AppLink}
      to={coLinksPaths.profile(invited.address ?? '')}
      noBorder
      css={{ position: 'relative' }}
    >
      <Flex css={{ gap: '$md', flex: 1 }}>
        <Flex
          css={{
            alignItems: 'center',
            gap: '$md',
            flex: 1,
          }}
        >
          <Avatar size={'large'} name={invited.name} path={invited.avatar} />
          <Flex column css={{ gap: '$xs', flexGrow: 1 }}>
            <Flex css={{ flexGrow: 1, justifyContent: 'space-between' }}>
              <Text semibold color={'default'}>
                {invited.name}
              </Text>
              <SimpleBuyButtonWithPrice
                links={invited.links ?? 0}
                target={invited.address ?? ''}
                setProgress={setBuyProgress}
                onSuccess={onBought}
              />
            </Flex>
            <Flex css={{ gap: '$md', alignItems: 'center' }}>
              <Flex css={{ flexShrink: 0 }}>
                <Text semibold size={'medium'}>
                  +{INVITE_SCORE_PER_INVITE_WITH_COSOUL} Rep
                </Text>
              </Flex>
              <Flex css={{ gap: '$xs', alignItems: 'center' }}>
                <Check color={'complete'} />
                <Text
                  css={{
                    color: '$dimText',
                  }}
                >
                  {code}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <LinkTxProgress message={buyProgress} />
    </Panel>
  );
};
