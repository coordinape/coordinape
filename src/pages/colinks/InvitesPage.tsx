import { useQuery } from 'react-query';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Check } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

const INVITES_QUERY_KEY = 'invites';

const fetchInvites = async () => {
  const { invite_codes } = await client.query(
    {
      invite_codes: [
        {
          order_by: [
            { updated_at: order_by.desc_nulls_last },
            { code: order_by.asc },
          ],
        },
        {
          code: true,
          invited: {
            avatar: true,
            name: true,
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'getMyInvites',
    }
  );
  return invite_codes;
};

export const InvitesPage = () => {
  const { data: invites } = useQuery([INVITES_QUERY_KEY], fetchInvites);

  const availableCodes = invites?.filter(i => !i.invited);

  // TODO: this includes users who haven't bought their own link yet, which might be weird to click through to
  const usedCodes = invites?.filter(i => !!i.invited);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Invite Codes
          </Text>
          <Text inline>
            Recruit new CoLinks members to boost your Rep Score
          </Text>
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
                      <Panel
                        as={AppLink}
                        to={coLinksPaths.profile(i.invited.address ?? '')}
                        key={i.code}
                        noBorder
                      >
                        <Flex css={{ gap: '$md' }}>
                          <Flex css={{ alignItems: 'center', gap: '$md' }}>
                            <Avatar
                              name={i.invited.name}
                              path={i.invited.avatar}
                            />
                            <Flex column css={{ gap: '$xs' }}>
                              <Text semibold>{i.invited.name}</Text>
                              <Flex css={{ gap: '$xs', alignItems: 'center' }}>
                                <Check color={'complete'} />
                                <Text
                                  css={{
                                    color: '$dimText',
                                  }}
                                >
                                  {i.code}
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Panel>
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
