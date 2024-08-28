import { useEffect, useState } from 'react';

import { getAllData } from 'features/auth/helpers';
import { useAccount } from 'wagmi';

import {
  disableFeatureLocally,
  enableFeatureLocally,
  FeatureName,
  FeatureNames,
  isFeatureEnabled,
} from '../../config/features';
import { Check, X } from '../../icons/__generated';
import { Box, Flex, HR, Text, ToggleButton } from '../../ui';
import { isMacBrowser } from '../SearchBox/SearchBox';
import useProfileId from 'hooks/useProfileId';
import { shortenAddressWithFrontLength } from 'utils';

export const DebugOverlay = () => {
  const featureNames = [...FeatureNames];
  featureNames.sort((a, b) => a.localeCompare(b));

  const localStorageDebugVar = 'coordinape:debugOverlayEnabled';

  const { connector, status, address: walletAddr } = useAccount();
  const profileId = useProfileId(false);

  const [invalidate, setInvalidate] = useState(0);
  const [debugOverlay, setDebugOverlay] = useState(
    !!localStorage.getItem(localStorageDebugVar)
  );

  useEffect(() => {
    window.focus();
    window.addEventListener('keydown', debugOverlayKeyDownHandler);
    return () => {
      window.removeEventListener('keydown', debugOverlayKeyDownHandler);
    };
  }, []);

  const debugOverlayKeyDownHandler = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'u') {
      setDebugOverlay(prev => !prev);
    }
  };

  useEffect(() => {
    if (debugOverlay) {
      localStorage.setItem(localStorageDebugVar, '1');
    } else {
      localStorage.removeItem(localStorageDebugVar);
    }
  }, [debugOverlay]);

  const setFeature = (featureName: FeatureName, enable: boolean) => {
    if (enable) {
      enableFeatureLocally(featureName);
    } else {
      disableFeatureLocally(featureName);
    }
    setInvalidate(inv => inv + 1);
  };

  if (!debugOverlay) {
    return null;
  }

  return (
    <Box
      key={invalidate}
      css={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        // width: 200,
        background: '$background',
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
        <HR />
        <Text size="xs" bold>
          {profileId ? 'Authenticated' : 'Not Authenticated'}
        </Text>
        {profileId && (
          <Flex column css={{ gap: '$xs' }}>
            <Text size="xs">Profile Id: {profileId}</Text>
            <Text size="xs" css={{ overflow: 'wrap', maxWidth: '200px' }}>
              Cookie Data:
              {JSON.stringify(getAllData().data)}
            </Text>
          </Flex>
        )}
        <HR />
        <Text size="xs" bold>
          Wallet Connection
        </Text>
        <Flex column css={{ gap: '$xs' }}>
          {connector && <Text size="xs">Connector: {connector?.name}</Text>}
          <Text size="xs">Status: {status}</Text>
          {walletAddr && (
            <Text size="xs">
              Wallet Addr:{' '}
              {walletAddr && shortenAddressWithFrontLength(walletAddr, 4)}
            </Text>
          )}
        </Flex>
        <HR />
        <Text size="xs" bold>
          Feature Flags
        </Text>
        <Flex column css={{ gap: '$xs' }}>
          {featureNames.map(featureName => (
            <Flex key={featureName} style={{ marginBottom: '10px' }}>
              <FeatureToggle
                featureName={featureName}
                setFeature={setFeature}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

const FeatureToggle = ({
  featureName,
  setFeature,
}: {
  featureName: FeatureName;
  setFeature: (featureName: FeatureName, enable: boolean) => void;
}) => {
  return (
    <>
      <Text size="xs" css={{ mr: '$sm', width: '100px' }}>
        {featureName}
      </Text>
      <Flex
        css={{
          width: '50%',
        }}
      >
        <ToggleButton
          color="complete"
          css={{ flex: 1, p: '$xs', mr: '$sm' }}
          active={isFeatureEnabled(featureName)}
          onClick={e => {
            e.preventDefault();
            setFeature(featureName, true);
          }}
        >
          <Check size="sm" /> On
        </ToggleButton>
        <ToggleButton
          color="destructive"
          css={{ flex: 1, p: '$xs' }}
          active={!isFeatureEnabled(featureName)}
          onClick={e => {
            e.preventDefault();
            setFeature(featureName, false);
          }}
        >
          <X size="sm" /> Off
        </ToggleButton>
      </Flex>
    </>
  );
};
