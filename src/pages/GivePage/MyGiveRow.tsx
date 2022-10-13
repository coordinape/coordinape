import React, { useState } from 'react';

import { useNavigate } from 'react-router';

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
}: {
  myUser: IMyUser;
  contributionCount: number;
}) => {
  const { updateMyUser } = useApiWithSelectedCircle();

  const { showError } = useApeSnackbar();

  const navigate = useNavigate();
  const [optOutOpen, setOptOutOpen] = useState(false);

  // updateNonReceiver toggles the current members desire to receive give
  const updateNonReceiver = async (nonReceiver: boolean) => {
    try {
      await updateMyUser({ non_receiver: nonReceiver });
    } catch (e) {
      showError(e);
    }
  };

  return (
    <Box onClick={() => navigate}>
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
                onClick={() =>
                  myUser.give_token_received > 0
                    ? setOptOutOpen(true)
                    : updateNonReceiver(true)
                }
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
