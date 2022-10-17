import { ApeInfoTooltip } from '../../components';
import { Check, X } from '../../icons/__generated';
import { IMyUser } from '../../types';
import { Box, Flex, Text, ToggleButton } from 'ui';

import { AvatarAndName } from './AvatarAndName';
import { GiveRowGrid } from './GiveRowGrid';
import { OptOutWarningModal } from './OptOutWarningModal';

// MyGiveRow is the top row on the give list, which is unique for the currently logged in member
export const MyGiveRow = ({
  myUser,
  userIsOptedOut,
  updateNonReceiver,
  isNonReceiverMutationLoading,
  contributionCount,
  openEpochStatement,
  optOutOpen,
  setOptOutOpen,
}: {
  myUser: IMyUser;
  userIsOptedOut: boolean;
  updateNonReceiver: (b: boolean) => void;
  isNonReceiverMutationLoading: boolean;
  contributionCount: number;
  openEpochStatement: () => void;
  setOptOutOpen: (b: boolean) => void;
  optOutOpen: boolean;
}) => {
  return (
    <Box onClick={openEpochStatement}>
      <GiveRowGrid
        selected={false}
        css={{ py: '$sm', borderColor: '$surface' }}
      >
        <AvatarAndName name={myUser.name} avatar={myUser.profile?.avatar} />
        <Flex
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'space-between',
            gap: '$lg',
            alignItems: 'center',
          }}
        >
          <Box>
            {/*shim to get the grid to line up*/}
            &nbsp;
          </Box>
          <Box>
            <Text variant="label" className="contributionLabel">
              {contributionCount} contribution
              {contributionCount == 1 ? '' : 's'}
            </Text>
          </Box>
        </Flex>
        <Flex css={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          {myUser.fixed_non_receiver ? (
            <Text variant="label">
              You are blocked from receiving {myUser.circle.tokenName}
            </Text>
          ) : (
            <>
              <Text variant="label" css={{ mr: '$md' }}>
                Receive Give?
                <ApeInfoTooltip>
                  Choose no if you want to opt-out from receiving{' '}
                  {myUser.circle.tokenName}
                </ApeInfoTooltip>
              </Text>
              <ToggleButton
                color="complete"
                css={{ mr: '$sm' }}
                active={!userIsOptedOut}
                disabled={isNonReceiverMutationLoading || !userIsOptedOut}
                onClick={e => {
                  e.stopPropagation();
                  updateNonReceiver(false);
                }}
              >
                <Check size="lg" /> Yes
              </ToggleButton>
              <ToggleButton
                color="destructive"
                active={userIsOptedOut}
                disabled={isNonReceiverMutationLoading || userIsOptedOut}
                onClick={e => {
                  e.stopPropagation();
                  myUser.give_token_received > 0
                    ? setOptOutOpen(true)
                    : updateNonReceiver(true);
                }}
              >
                <X size="lg" /> No
              </ToggleButton>
            </>
          )}
        </Flex>
      </GiveRowGrid>
      <OptOutWarningModal
        optOutOpen={optOutOpen}
        setOptOutOpen={setOptOutOpen}
        updateNonReceiver={updateNonReceiver}
        tokenName={myUser.circle.tokenName}
        give_token_received={myUser.give_token_received}
      />
    </Box>
  );
};
