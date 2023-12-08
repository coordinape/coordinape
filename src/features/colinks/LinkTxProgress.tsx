import { Flex, Text } from '../../ui';

export const LinkTxProgress = ({ message }: { message: string }) => {
  return (
    <Flex
      css={{
        display: message != '' ? 'flex' : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        p: '$md',
        justifyItems: 'space-around',
        justifyContent: 'space-around',
        alignItems: 'center',
        textAlign: 'center',
        background: `linear-gradient(.15turn, color-mix(in srgb, $linkOwnedHighlight 35%, $background), $surfaceNested)`,
        zIndex: 11,
        borderRadius: '$3',
        border: '1px solid $linkOwnedHighlight',
        // opacity: 0.95,
      }}
    >
      <Text color="coLinksCta" semibold>
        {message}
      </Text>
    </Flex>
  );
};
