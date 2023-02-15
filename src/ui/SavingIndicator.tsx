import React from 'react';

import { CSS } from 'stitches.config';

import { Check, RefreshCcw, AlertTriangle } from 'icons/__generated';
import { Button, Flex, Text } from 'ui';

export const StateOptions = [
  'stable', // nothing needs to happen
  'buffering', // dirty, and we need to schedule
  'scheduled', // we are actually scheduled to save to backend
  'saving', // we are actively saving to backend
  'saved', // we just saved to backend
  'error', // we received an error or unexpected state
] as const;
export type SaveState = typeof StateOptions[number];

// stable->buffering = something was dirtied
// buffering->scheduled =  dirty state causes scheduling
// scheduled->saving = we actually fired the debounced operation to save to backend
// saving->scheduled = a user dirtied state WHILE we are saving, so we need to re-run save when we finish
// saving->saved = we saved and there are no dirty changes that occurred while we were saving

// SavingIndicator indicates whether state is stable, being saved, or has recently been saved
export const SavingIndicator = ({
  saveState,
  css,
  retry,
}: {
  saveState: SaveState;
  css?: CSS;
  retry?: () => void;
}) => {
  return (
    <Flex alignItems="center" css={{ ...css }}>
      <Text size="small">
        {(saveState == 'saving' ||
          saveState == 'scheduled' ||
          saveState == 'buffering') && (
          <Text color="neutral" css={{ gap: '$xs' }}>
            <RefreshCcw /> Saving
          </Text>
        )}
        {saveState == 'saved' && (
          <Text color="complete" css={{ gap: '$xs' }}>
            <Check /> Saved
          </Text>
        )}
        {saveState == 'error' && (
          <Flex css={{ gap: '$xs' }}>
            <Text color="alert" css={{ gap: '$xs' }}>
              <AlertTriangle />
              Error Saving
            </Text>
            {retry && (
              <Button size="small" css={{ ml: '$xs' }} onClick={retry}>
                Retry
              </Button>
            )}
          </Flex>
        )}
      </Text>
    </Flex>
  );
};
