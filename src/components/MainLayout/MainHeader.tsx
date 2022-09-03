import { Suspense } from 'react';

import { useLocation } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { MediaQueryKeys } from 'stitches.config';

import { ReceiveInfo, MyAvatarMenu } from 'components';
import isFeatureEnabled from 'config/features';
import { useMediaQuery } from 'hooks';
import { rSelectedCircle } from 'recoilState/app';
import { isCircleSpecificPath } from 'routes/paths';
import { AppLink, Box, Button } from 'ui';

import { CircleNav } from './CircleNav';
import { useMainHeaderQuery } from './getMainHeaderData';
import { MobileHeader } from './MobileHeader';
import { OverviewMenu } from './OverviewMenu';

export const MainHeader = () => {
  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle = !!(circle && isCircleSpecificPath(location));
  const breadcrumb = inCircle ? `${circle.protocol.name} > ${circle.name}` : '';

  if (useMediaQuery(MediaQueryKeys.sm))
    return (
      <Suspense fallback={null}>
        <MobileHeader inCircle={!!inCircle} breadcrumb={breadcrumb} />
      </Suspense>
    );

  return <NormalHeader inCircle={inCircle} />;
};

const NormalHeader = ({ inCircle }: { inCircle: boolean }) => {
  const query = useMainHeaderQuery();
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
            <ReceiveInfo />
          </Suspense>
        )}
        <Suspense fallback={null}>
          {isFeatureEnabled('vaults') && showClaimsButton && (
            <AppLink to="/claims">
              <Button color="complete" size="small">
                Claim Tokens
              </Button>
            </AppLink>
          )}
          <MyAvatarMenu />
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
