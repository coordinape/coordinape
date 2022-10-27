import React from 'react';

import { CSS } from 'stitches.config';

import { Check, RefreshCcw, AlertTriangle } from 'icons/__generated';
import { Flex, Text } from 'ui';

export type SaveState =
  | 'stable' // nothing needs to happen
  | 'buffering' // dirty, and we need to schedule
  | 'scheduled' // we are actually scheduled to save to backend
  | 'saving' // we are actively saving to backend
  | 'saved' // we just saved to backend
  | 'error'; // we received an error or unexpected state

// stable->buffering = something was dirtied
// buffering->scheduled =  dirty state causes scheduling
// scheduled->saving = we actually fired the debounced operation to save to backend
// saving->scheduled = a user dirtied state WHILE we are saving, so we need to re-run save when we finish
// saving->saved = we saved and there are no dirty changes that occurred while we were saving

// SavingIndicator indicates whether state is stable, being saved, or has recently been saved
export const SavingIndicator = ({
  saveState,
  css,
}: {
  saveState: SaveState;
  css?: CSS;
}) => {
  const color = saveState == 'error' ? 'alert' : 'neutral';
  return (
    <Flex css={{ ...css, minHeight: '$lg', alignItems: 'center' }}>
      <Text size="small" color={color} css={{ gap: '$xs' }}>
        {(saveState == 'saving' ||
          saveState == 'scheduled' ||
          saveState == 'buffering') && (
          <>
            <RefreshCcw /> Saving...
          </>
        )}
        {saveState == 'saved' && (
          <>
            <Check /> Saved
          </>
        )}
        {saveState == 'error' && (
          <>
            <AlertTriangle />
            Error Saving
          </>
        )}
      </Text>
    </Flex>
  );
};
