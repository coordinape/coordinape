import { Navigate, useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { useHasCircles } from 'hooks/migration';
import { rManifest } from 'recoilState/db';
import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_TWITTER,
  paths,
} from 'routes/paths';
import { Box, Button, Flex, Text } from 'ui';

export const DefaultPage = () => {
  const navigate = useNavigate();

  const manifest = useRecoilValueLoadable(rManifest).valueMaybe();
  const hasCircles = useHasCircles();

  // still loading
  if (!manifest) return null;

  if (!hasCircles) {
    return (
      <Flex
        column
        css={{
          maxWidth: '700px',
          mx: 'auto',
          pt: '$2xl',
          px: '$lg',
          '> p': { mt: 0, mb: '$md', color: '$text', fontSize: '$medium' },
        }}
      >
        <Text h1 css={{ justifyContent: 'center', mb: '$md' }}>
          Welcome!
        </Text>
        <p>This wallet isn&apos;t associated with a circle.</p>
        <p>
          If you are supposed to be part of a circle already, contact your
          circle&apos;s admin to make sure they added this address:{' '}
          {manifest.myProfile.address}
        </p>
        <p>Or, create a new circle.</p>
        <Button
          color="secondary"
          size="large"
          onClick={() => navigate(paths.createCircle)}
          css={{ alignSelf: 'center' }}
        >
          Start a Circle
        </Button>
        <Footer />
      </Flex>
    );
  }

  return <Navigate to="/circles" replace />;
};

const Footer = () => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      pt: '$2xl',
      pb: '$xl',
      '> a': {
        padding: '$md 0',
        color: '$text',
        textDecoration: 'none',
        fontWeight: '$semibold',
        fontSize: '$large',
      },
    }}
  >
    <a target="_blank" rel="noreferrer" href="https://coordinape.com">
      coordinape.com
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_DISCORD}>
      Discord
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_TWITTER}>
      Twitter
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_DOCS}>
      Docs
    </a>
  </Box>
);

export default DefaultPage;
