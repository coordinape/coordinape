import { Panel, Box } from 'ui';

/**
 * Shows a custom error message when unauthorized access is detected.
 * @param message string
 * @returns JSX.Element
 */
function ShowMessage({ message }: { message: string }) {
  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        m: '$lg',
        margin: 'auto',
        maxWidth: '90%',
      }}
    >
      <Panel>
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 30,
            mt: '$lg',
            justifyContent: 'center',
            color: '$text',
          }}
        >
          {message}
        </Box>
      </Panel>
    </Box>
  );
}

export default ShowMessage;
