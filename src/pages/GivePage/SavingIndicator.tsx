import React from 'react';

import { Check, RefreshCcw } from '../../icons/__generated';
import { CSS } from '../../stitches.config';
import { Flex, Text } from '../../ui';

// SavingIndicator indicates whether state is stable, being saved, or has recently been saved
export const SavingIndicator = ({
  needToSave,
  css,
}: {
  needToSave: boolean | undefined;
  css?: CSS;
}) => {
  return (
    <Flex css={{ ...css, minHeight: '$lg', alignItems: 'center' }}>
      <Text size="small" color="neutral" css={{ gap: '$xs' }}>
        {needToSave === true && (
          <>
            <RefreshCcw /> Saving Changes
          </>
        )}
        {needToSave === false && (
          <>
            <Check /> Changes Saved!
          </>
        )}
      </Text>
    </Flex>
  );
};
