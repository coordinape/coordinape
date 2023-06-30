import { Text } from 'ui';

export const WebglMessage = ({ webglEnabled }: { webglEnabled?: boolean }) => {
  if (webglEnabled) {
    return <></>;
  }
  return (
    <Text
      tag
      color="alert"
      css={{
        zIndex: 3,
        position: 'absolute',
        height: 'auto',
        top: '2rem',
        width: '80%',
        whiteSpace: 'normal',
        ml: '10%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '$sm',
      }}
    >
      <Text semibold>CoSoul artwork is built with WebGL.</Text>
      <Text>
        To view artwork please enable WebGL in your browser, and do not
        aggressively block fingerprinting.
      </Text>
    </Text>
  );
};
