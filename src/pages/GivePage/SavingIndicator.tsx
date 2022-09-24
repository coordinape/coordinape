import React from 'react';

import { Check, RefreshCcw } from '../../icons/__generated';
import { CSS } from '../../stitches.config';
import { Box, Flex, Text } from '../../ui';

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
      <Text size="small" color="neutral">
        {needToSave === true && (
          <Box>
            <RefreshCcw /> Saving Changes
          </Box>
        )}
        {needToSave === false && (
          <Box>
            <Check /> Changes Saved!
          </Box>
        )}
      </Text>
    </Flex>
  );
};
