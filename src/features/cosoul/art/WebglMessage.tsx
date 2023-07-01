import { artWidth } from '../constants';
import { Flex, Text } from 'ui';

const messageStyles = {
  height: 'auto',
  width: '80%',
  maxWidth: '400px',
  whiteSpace: 'normal',
  m: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: '$sm',
};

export const WebglMessage = ({ webglEnabled }: { webglEnabled?: boolean }) => {
  return (
    <Flex
      column
      css={{
        position: 'absolute',
        zIndex: 3,
        top: '$2xl',
        gap: '$md',
        width: artWidth,
      }}
    >
      {webglEnabled ? (
        <Text
          tag
          color="alert"
          // this message is removed by the webgl animation code if webgl is working
          id="aggressionMessage"
          css={{ ...messageStyles }}
        >
          <Text semibold>CoSoul artwork requires WebGL</Text>
          <Text>
            Your browser settings are blocking WebGL. Do not set your
            fingerprint settings to &apos;Aggressive&apos;.
          </Text>
        </Text>
      ) : (
        <Text tag color="alert" css={{ ...messageStyles }}>
          <Text semibold>CoSoul artwork requires WebGL</Text>
          <Text>To view artwork please enable WebGL in your browser.</Text>
        </Text>
      )}
    </Flex>
  );
};
