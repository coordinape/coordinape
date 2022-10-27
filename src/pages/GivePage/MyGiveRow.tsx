import { useEffect, useRef, useState } from 'react';

import { ApeInfoTooltip } from '../../components';
import { Check, X } from '../../icons/__generated';
import { IMyUser } from '../../types';
import { Box, Button, Flex, Text, ToggleButton } from 'ui';

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
  statementCompelete,
  selected,
}: {
  myUser: IMyUser;
  userIsOptedOut: boolean;
  updateNonReceiver: (b: boolean) => void;
  isNonReceiverMutationLoading: boolean;
  contributionCount: number;
  openEpochStatement: () => void;
  setOptOutOpen: (b: boolean) => void;
  optOutOpen: boolean;
  statementCompelete: boolean;
  selected: boolean;
}) => {
  const newRef = useRef<HTMLButtonElement>(null);
  const [lastSelected, setLastSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selected) {
      // eslint-disable-next-line no-console
      console.log('if selected', newRef?.current);
      setLastSelected(true);
    } else {
      if (lastSelected) {
        // eslint-disable-next-line no-console
        console.log('if last selected', newRef?.current);
        newRef?.current?.focus();
      }
      setLastSelected(false);
    }
  }, [selected, lastSelected]);
  return (
    <Button
      onClick={openEpochStatement}
      color="transparent"
      css={{ p: 0 }}
      ref={newRef}
    >
      <GiveRowGrid
        selected={selected}
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
          <Flex
            css={{
              gap: '$md',
              '@sm': {
                mt: '$md',
              },
            }}
          >
            <Text
              variant="label"
              className="contributionLabel"
              css={{
                whiteSpace: 'nowrap',
              }}
            >
              {contributionCount} contribution
              {contributionCount == 1 ? '' : 's'}
            </Text>
            {!statementCompelete && (
              <Text tag color="primary">
                No Epoch Statement
              </Text>
            )}
          </Flex>
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
    </Button>
  );
};
