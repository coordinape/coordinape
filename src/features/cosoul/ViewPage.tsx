import { useEffect, useRef, useState } from 'react';

import { useAuthStateMachine } from 'features/auth/RequireAuth';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CosoulData } from '../../../api/cosoul/[address]';
import { LoadingModal } from 'components';
import isFeatureEnabled from 'config/features';
import { Box, Canvas, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { artWidth } from '.';
import { CoSoulArt } from './art/CoSoulArt';
import { CoSoulArtContainer, coSoulCloud } from './CoSoulArtContainer';
import { CoSoulComposition } from './CoSoulComposition';
import { CoSoulDetails } from './CoSoulDetails';
import { CoSoulProfileInfo } from './CoSoulProfileInfo';
import { CoSoulPromo } from './CoSoulPromo';

export const QUERY_KEY_COSOUL_VIEW = 'cosoul_view';
export const ViewPage = () => {
  useAuthStateMachine(false, false);
  const { address } = useParams();

  let coSoulMinted;
  const { data, isError, isLoading, error } = useQuery(
    [QUERY_KEY_COSOUL_VIEW, address],
    async (): Promise<CosoulData> => {
      const res = await fetch('/api/cosoul/' + address);
      if (res.status === 404) {
        coSoulMinted = false;
      } else if (!res.ok) {
        throw new Error('Failed to fetch cosoul data');
      }
      return res.json();
    },
    {
      enabled: !!address,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
  coSoulMinted = !!data?.mintInfo;
  const webglTest = useRef<HTMLCanvasElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(true);

  useEffect(() => {
    const canvas = webglTest.current;
    const checkWebglEnabled = () => {
      if (canvas) {
        const webglEnabled = !!canvas.getContext('webgl2');
        setWebglEnabled(webglEnabled);
      }
    };
    checkWebglEnabled();
  }, []);

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }

  // Waiting to validate the token
  if (isLoading) {
    return (
      <>
        <Canvas
          ref={webglTest}
          css={{
            position: 'absolute',
            zIndex: -1,
            left: -5000,
          }}
        />
        <LoadingModal visible={true} note="cosoul-lookup" />
      </>
    );
  }

  // Error
  if (isError) {
    return (
      <SingleColumnLayout
        css={{
          m: 'auto',
          alignItems: 'center',
          gap: 0,
          maxWidth: '1200px',
          minHeight: '100vh',
        }}
      >
        <Text h1 color="alert">
          {(error as string).toString()}
        </Text>
      </SingleColumnLayout>
    );
  }

  return (
    <SingleColumnLayout
      css={{
        m: 'auto',
        alignItems: 'center',
        maxWidth: '1200px',
        gap: '$1xl',
        mb: 200,
      }}
    >
      {data && coSoulMinted ? (
        <>
          <CoSoulProfileInfo cosoul_data={data} />
          <CoSoulPromo cosoul_data={data} address={address} />
          <CoSoulComposition cosoul_data={data}>
            <CoSoulArtContainer cosoul_data={data} webglEnabled={webglEnabled}>
              <CoSoulArt
                pGive={data.totalPgive}
                address={address}
                webglEnabled={webglEnabled}
              />
            </CoSoulArtContainer>
          </CoSoulComposition>
          <CoSoulDetails cosoul_data={data} />
        </>
      ) : (
        <Flex
          column
          css={{
            justifyContent: 'center',
            height: `${artWidth}`,
            alignItems: 'center',
            position: 'relative',
            gap: '$sm',
          }}
        >
          <Text tag color="secondary">
            No CoSoul minted for this address
          </Text>
          {data && (
            <CoSoulPromo css={{ mt: 0 }} cosoul_data={data} address={address} />
          )}
          <Box css={{ ...coSoulCloud }} />
        </Flex>
      )}
    </SingleColumnLayout>
  );
};
