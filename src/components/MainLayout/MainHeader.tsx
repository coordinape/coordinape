import { Suspense } from 'react';

import { useWalletStatus } from 'features/auth';
import { NavLink, useLocation } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { MediaQueryKeys, Theme } from 'stitches.config';

import { ReceiveInfo, MyAvatarMenu } from 'components';
import isFeatureEnabled from 'config/features';
import { useMediaQuery } from 'hooks';
import { rSelectedCircle } from 'recoilState/app';
import { isCircleSpecificPath } from 'routes/paths';
import { Box, Button, Modal } from 'ui';

import { CircleNav } from './CircleNav';
import { CreateUserNameForm } from './CreateUserNameForm';
import { MainHeaderQuery, useMainHeaderQuery } from './getMainHeaderData';
import { MobileHeader } from './MobileHeader';
import { OverviewMenu } from './OverviewMenu';
import { SampleOrgIndicator } from './SampleOrgIndicator';

export const MainHeader = ({
  currentTheme,
  setCurrentTheme,
}: {
  currentTheme?: string;
  setCurrentTheme(t: Theme): void;
}) => {
  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle =
    circle && isCircleSpecificPath(location) ? circle : undefined;
  const walletStatus = useWalletStatus();
  const query = useMainHeaderQuery();

  const isMobile = useMediaQuery(MediaQueryKeys.sm);
  const profile = query.data?.profiles?.[0];
  const showNameForm = profile && !profile.name && !!walletStatus.address;

  return (
    <>
      {isMobile ? (
        <Suspense fallback={null}>
          <MobileHeader
            inCircle={inCircle}
            walletStatus={walletStatus}
            query={query}
          />
        </Suspense>
      ) : (
        <NormalHeader
          inCircle={inCircle}
          walletStatus={walletStatus}
          query={query}
          setCurrentTheme={setCurrentTheme}
          currentTheme={currentTheme}
        />
      )}
      {showNameForm && (
        <Modal open title="What's your name?" css={{ overflow: 'scroll' }}>
          <CreateUserNameForm address={walletStatus.address} />
        </Modal>
      )}
    </>
  );
};

interface Circle {
  organization: {
    sample: boolean;
  };
}

type Props = {
  inCircle?: Circle;
  walletStatus: ReturnType<typeof useWalletStatus>;
  query: MainHeaderQuery;
  currentTheme?: string;
  setCurrentTheme(t: Theme): void;
};

const NormalHeader = ({
  inCircle,
  walletStatus,
  query,
  currentTheme,
  setCurrentTheme,
}: Props) => {
  const showClaimsButton =
    (query.data?.claims_aggregate.aggregate?.count || 0) > 0;

  return (
    <Box>
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
            <MyAvatarMenu
              walletStatus={walletStatus}
              setCurrentTheme={setCurrentTheme}
              currentTheme={currentTheme}
            />
          </Suspense>
        </Box>
      </Box>
      {inCircle?.organization.sample && <SampleOrgIndicator />}
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
