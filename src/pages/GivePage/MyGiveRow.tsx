import React from 'react';

import { ApeInfoTooltip } from '../../components';
import { useApeSnackbar, useApiWithSelectedCircle } from '../../hooks';
import { Check, X } from '../../icons/__generated';
import { IMyUser } from '../../types';
import { Box, Button, Flex, Text, ToggleButton } from 'ui';

import { AvatarAndName } from './AvatarAndName';
import { GiveRowGrid } from './GiveRowGrid';

// MyGiveRow is the top row on the give list, which is unique for the currently logged in member
export const MyGiveRow = ({
  myUser,
  contributionCount,
}: {
  myUser: IMyUser;
  contributionCount: number;
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
    <Box
      css={{
        '& .contributionButton': {
          display: 'none',
        },
        '& .contributionLabel': {
          display: 'block',
        },
        '&:hover': {
          // '& .contributionLabel': {
          //   display: 'none',
          // },
          '& .contributionButton': {
            display: 'block',
          },
        },
      }}
    >
      <GiveRowGrid selected={false} css={{ py: '$sm' }}>
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
            <Button
              className="contributionButton"
              outlined
              size="small"
              color="primary"
              // css={{
              //   ml: 'calc(-1*$sm)',
              // }}
            >
              {contributionCount > 0 ? (
                <>
                  Edit {contributionCount} Contribution
                  {contributionCount == 1 ? '' : 's'}
                </>
              ) : (
                <>Add Contributions</>
              )}
            </Button>
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
                  Choose no if you want to opt-out from receiving
                  {myUser.circle.tokenName}
                </ApeInfoTooltip>
              </Text>
              <ToggleButton
                color="complete"
                css={{ mr: '$sm' }}
                active={!myUser.non_receiver}
                disabled={!myUser.non_receiver}
                onClick={() => updateNonReceiver(false)}
              >
                <Check size="lg" /> Yes
              </ToggleButton>
              <ToggleButton
                color="destructive"
                active={myUser.non_receiver}
                disabled={myUser.non_receiver}
                onClick={() => updateNonReceiver(true)}
              >
                <X size="lg" /> No
              </ToggleButton>
            </>
          )}
        </Flex>
      </GiveRowGrid>
    </Box>
  );
};
