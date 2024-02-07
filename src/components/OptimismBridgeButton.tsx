import { ExternalLink } from 'icons/__generated';
import { Button, Text, Link } from 'ui';

export const OptimismBridgeButton = () => {
  return (
    <Button
      as={Link}
      href="https://app.optimism.io/bridge/deposit"
      target={'_blank'}
      rel="noreferrer"
      css={{
        whiteSpace: 'normal',
      }}
    >
      <Text
        inline
        css={{
          fontWeight: '$medium',
          alignItems: 'center',
          width: '100%',
          textAlign: 'center',
        }}
      >
        Bridge ETH using the
        <br />
        Optimism Bridge
        <ExternalLink css={{ ml: '$xs', mt: -3 }} />
      </Text>
    </Button>
  );
};
