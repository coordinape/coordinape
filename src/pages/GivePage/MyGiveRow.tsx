import { ApeInfoTooltip } from '../../components';
import { useApeSnackbar, useApiWithSelectedCircle } from '../../hooks';
import { Check, X } from '../../icons/__generated';
import { IMyUser } from '../../types';
import { Box, Flex, Text, ToggleButton } from 'ui';

import { AvatarAndName } from './AvatarAndName';
import { GiveRowGrid } from './GiveRowGrid';
import { OptOutWarningModal } from './OptOutWarningModal';

// MyGiveRow is the top row on the give list, which is unique for the currently logged in member
export const MyGiveRow = ({
  myUser,
  contributionCount,
  openEpochStatement,
  optOutOpen,
  setOptOutOpen,
}: {
  myUser: IMyUser;
  contributionCount: number;
  openEpochStatement: () => void;
  setOptOutOpen: (b: boolean) => void;
  optOutOpen: boolean;
}) => {
  const { updateMyUser } = useApiWithSelectedCircle();

  const { showError } = useApeSnackbar();

  // updateNonReceiver toggles the current members desire to receive give
  const updateNonReceiver = async (nonReceiver: boolean) => {
    try {
      await updateMyUser({ non_receiver: nonReceiver });
    } catch (e) {
      showError(e);
    }
  };

  return (
    <Box onClick={openEpochStatement}>
      <GiveRowGrid
        selected={false}
        css={{
          pl: '$md',
          borderColor: '$surface',
          '@sm': {
            py: '$sm',
          },
        }}
      >
        <AvatarAndName name={myUser.name} avatar={myUser.profile?.avatar} />
        <Flex
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'space-between',
            gap: '$lg',
            alignItems: 'center',
            '@sm': {
              gridTemplateColumns: '1fr',
              justifyItems: 'center',
              gap: '$md',
            },
          }}
        >
          <Box
            css={{
              '@sm': {
                display: 'none',
              },
            }}
          >
            {/*shim to get the grid to line up*/}
            &nbsp;
          </Box>
          <Box>
            <Text
              variant="label"
              className="contributionLabel"
              css={{
                '@sm': {
                  mt: '$md',
                },
              }}
            >
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
            <Flex
              css={{
                gap: '$md',
                '@sm': {
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '$sm',
                  mb: '$xs',
                  mt: '$md',
                },
              }}
            >
              <Text variant="label">
                Receive Give?
                <ApeInfoTooltip>
                  Choose no if you want to opt-out from receiving{' '}
                  {myUser.circle.tokenName}
                </ApeInfoTooltip>
              </Text>
              <Flex>
                <ToggleButton
                  color="complete"
                  css={{ mr: '$sm' }}
                  active={!myUser.non_receiver}
                  disabled={!myUser.non_receiver}
                  onClick={e => {
                    e.stopPropagation();
                    updateNonReceiver(false);
                  }}
                >
                  <Check size="lg" /> Yes
                </ToggleButton>
                <ToggleButton
                  color="destructive"
                  active={myUser.non_receiver}
                  disabled={myUser.non_receiver}
                  onClick={e => {
                    e.stopPropagation();
                    myUser.give_token_received > 0
                      ? setOptOutOpen(true)
                      : updateNonReceiver(true);
                  }}
                >
                  <X size="lg" /> No
                </ToggleButton>
              </Flex>
            </Flex>
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
