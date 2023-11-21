import { ArrowRight, LogOut } from '../../../icons/__generated';
import { coLinksPaths } from '../../../routes/paths';
import { Button, Link, Text, Flex, AppLink } from '../../../ui';

export function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <Flex column css={{ width: '100%', gap: '$md', alignItems: 'center' }}>
      <Button
        outlined
        color={'secondary'}
        as={Link}
        inlineLink
        onClick={onClick}
        css={{
          '&:hover': { textDecoration: 'none' },
          width: '100%',
          alignItems: 'center',
          gap: '$xs',
        }}
      >
        <Text>Continue</Text> <ArrowRight />
      </Button>
      <AppLink
        inlineLink
        to={coLinksPaths.home}
        css={{
          fontSize: '$small',
          color: '$neutral',
          gap: '$xs',
          whiteSpace: 'nowrap',
          display: 'flex',
        }}
      >
        <LogOut />
        <Text>Take me to the app</Text>
      </AppLink>
    </Flex>
  );
}
