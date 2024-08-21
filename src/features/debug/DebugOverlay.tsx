import { useState } from 'react';

import {
  disableFeatureLocally,
  enableFeatureLocally,
  FeatureName,
  FeatureNames,
  isFeatureEnabled,
} from '../../config/features';
import { Check } from '../../icons/__generated';
import { Box, Flex, Text, ToggleButton } from '../../ui';
import { isMacBrowser } from '../SearchBox/SearchBox';

export const DebugOverlay = () => {
  const featureNames = [...FeatureNames];
  featureNames.sort((a, b) => a.localeCompare(b));

  const [invalidate, setInvalidate] = useState(0);

  const setFeature = (featureName: FeatureName, enable: boolean) => {
    if (enable) {
      enableFeatureLocally(featureName);
    } else {
      disableFeatureLocally(featureName);
    }
    setInvalidate(inv => inv + 1);
  };

  return (
    <Box
      key={invalidate}
      css={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        // width: 200,
        background: 'rgba(255, 255, 255, 1.0)',
        border: '1px solid $borderFocus',
        borderRadius: '$3',
        p: '$md',
        m: '$md',
      }}
    >
      <Flex column css={{ gap: '$sm' }}>
        <Text size="medium" bold>
          Debug Zone
        </Text>
        <Text size={'xs'} color={'neutral'}>
          {isMacBrowser() ? '⌘' : 'Ctrl-'}U to Dismiss
        </Text>
        <Text size="xs" bold>
          Feature Flags
        </Text>
        <Flex column css={{ gap: '$xs' }}>
          {featureNames.map(featureName => (
            <ToggleButton
              key={featureName}
              color="complete"
              css={{ width: '100%' }}
              active={isFeatureEnabled(featureName)}
              name={featureName}
              onClick={e => {
                e.preventDefault();
                setFeature(featureName, !isFeatureEnabled(featureName));
              }}
            >
              <Check size="sm" /> <Text size={'xs'}>{featureName}</Text>
            </ToggleButton>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};
