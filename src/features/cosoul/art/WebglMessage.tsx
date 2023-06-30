import { Flex, Text } from 'ui';

export const WebglMessage = ({ webglEnabled }: { webglEnabled?: boolean }) => {
  return (
    <Flex
      column
      css={{
        position: 'absolute',
        zIndex: 3,
        top: '$2xl',
        gap: '$md',
        width: '100%',
      }}
    >
      {webglEnabled ? (
        <Text
          tag
          color="alert"
          // this message is removed by the webgl animation code if webgl is working
          id="aggressionMessage"
          css={{
            height: 'auto',
            width: '80%',
            whiteSpace: 'normal',
            m: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: '$sm',
          }}
        >
          <Text semibold>CoSoul artwork requires WebGL</Text>
          <Text>
            Your browser settings are blocking WebGL. Do not set your
            fingerprint settings to &apos;Aggressive&apos;.
          </Text>
        </Text>
      ) : (
        <Text
          tag
          color="alert"
          css={{
            height: 'auto',
            width: '80%',
            whiteSpace: 'normal',
            m: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: '$sm',
          }}
        >
          <Text semibold>CoSoul artwork requires WebGL</Text>
          <Text>To view artwork please enable WebGL in your browser.</Text>
        </Text>
      )}
    </Flex>
  );
};
