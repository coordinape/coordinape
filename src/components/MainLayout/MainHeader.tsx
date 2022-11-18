import { Suspense } from 'react';

import { NavLink, useLocation } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { MediaQueryKeys } from 'stitches.config';

import { ReceiveInfo, MyAvatarMenu } from 'components';
import isFeatureEnabled from 'config/features';
import { useMediaQuery } from 'hooks';
import { useWalletStatus, WalletStatus } from 'hooks/login';
import { rSelectedCircle } from 'recoilState/app';
import { isCircleSpecificPath } from 'routes/paths';
import { Box, Button } from 'ui';

import { CircleNav } from './CircleNav';
import { MainHeaderQuery, useMainHeaderQuery } from './getMainHeaderData';
import { MobileHeader } from './MobileHeader';
import { OverviewMenu } from './OverviewMenu';

import { IApiCircle } from 'types';

export const MainHeader = () => {
  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle =
    circle && isCircleSpecificPath(location) ? circle : undefined;
  const walletStatus = useWalletStatus();
  const query = useMainHeaderQuery();

  if (useMediaQuery(MediaQueryKeys.sm))
    return (
      <Suspense fallback={null}>
        <MobileHeader
          inCircle={inCircle}
          walletStatus={walletStatus}
          query={query}
        />
      </Suspense>
    );

  return (
    <NormalHeader
      inCircle={inCircle}
      walletStatus={walletStatus}
      query={query}
    />
  );
};

type Props = {
  inCircle?: IApiCircle;
  walletStatus: WalletStatus;
  query: MainHeaderQuery;
};
const NormalHeader = ({ inCircle, walletStatus, query }: Props) => {
  const showClaimsButton =
    (query.data?.claims_aggregate.aggregate?.count || 0) > 0;

  return (
    <Box
      css={{
        px: '$xl',
        height: '$headerHeight',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        background: '$headingText',
        zIndex: '4',
      }}
    >
      <Box
        css={{
          p: '$sm $md $xs',
          color: '$neutral',
          fontWeight: '$black',
        }}
      >
        COORDINAPE
      </Box>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          '@md': {
            a: { fontSize: '$md' },
          },
        }}
      >
        <OverviewMenu data={query.data} />
        <Box
          css={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-start',
            position: 'relative',
          }}
        >
          {inCircle && (
            <Box>
              <Suspense fallback={null}>
                <CircleNav />
              </Suspense>
            </Box>
          )}
        </Box>
        {inCircle && (
          <Suspense fallback={null}>
            <Box
              css={{
                mr: '$md',
                '@md': {
                  scale: 0.8,
                },
              }}
            >
              <ReceiveInfo />
            </Box>
          </Suspense>
        )}
        <Suspense fallback={null}>
          {isFeatureEnabled('vaults') && showClaimsButton && (
            <Button
              as={NavLink}
              to="/claims"
              css={{ mr: '$md' }}
              color="complete"
              size="small"
            >
              Claim Tokens
            </Button>
          )}
          <MyAvatarMenu walletStatus={walletStatus} />
        </Suspense>
      </Box>
    </Box>
  );
};

export const menuGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid $border',
  width: '100%',
  mt: '$md',
  'a, label': {
    mt: '$sm',
  },
};

export default MainHeader;
