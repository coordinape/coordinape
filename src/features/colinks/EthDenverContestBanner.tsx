import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import HintBanner from 'components/HintBanner';
import { coLinksPaths } from 'routes/paths';
import { Flex, Text, Button } from 'ui';

export const EthDenverContestBanner = ({ address }: { address: string }) => {
  const { data: checkEthDenverInvitee } = useQuery(
    ['colink_checkEthDenverInvitee', address, 'wizard'],
    async () => {
      const { checkEthDenverInvitee } = await client.query(
        {
          checkEthDenverInvitee: { is_eth_denver_invitee: true },
        },
        {
          operationName: 'coLinks_wizard',
        }
      );
      return checkEthDenverInvitee;
    }
  );
  return (
    <>
      {checkEthDenverInvitee?.is_eth_denver_invitee && (
        <Flex css={{ mt: '$md' }}>
          <HintBanner
            title={'Welcome ETH Denver'}
            dismissible="eth-denver-contest"
          >
            <Text inline p as="p">
              <Text semibold inline>
                Invite your friends to CoLinks
              </Text>
              , and for each one that joins you&apos;ll receive an additional
              contest entry (max 10 additional entries).
            </Text>
            <Button as={NavLink} color="secondary" to={coLinksPaths.invites}>
              Get invite codes
            </Button>
          </HintBanner>
        </Flex>
      )}
    </>
  );
};
