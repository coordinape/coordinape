import React from 'react';

import { ApeInfoTooltip } from '../../components';
import { useApeSnackbar, useApiWithSelectedCircle } from '../../hooks';
import { Check, X } from '../../icons/__generated';
import { IMyUser } from '../../types';
import { Flex, Panel, Text } from '../../ui';

import { AvatarAndName } from './AvatarAndName';
import { ToggleButton } from './ToggleButton';

// MyGiveRow is the top row on the give list, which is unique for the currently logged in member
export const MyGiveRow = ({ myUser }: { myUser: IMyUser }) => {
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
    <Panel nested css={{ pl: '$xs', pr: '$md', py: '$xs' }}>
      <Flex alignItems="center">
        <Flex
          alignItems="center"
          css={{ flexGrow: 1, justifyContent: 'flex-start' }}
        >
          <AvatarAndName name={myUser.name} avatar={myUser.profile?.avatar} />
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
      </Flex>
    </Panel>
  );
};
