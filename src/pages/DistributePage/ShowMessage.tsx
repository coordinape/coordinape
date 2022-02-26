import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Panel, Box, Link } from 'ui';

/**
 * Shows a custom error message when unauthorized access is detected.
 * @param message string
 * @returns JSX.Element
 */
function ShowMessage({ message, path }: { message: string; path?: string }) {
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
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            mt: '$lg',
          }}
        >
          <Box css={{ minWidth: '15%' }}>
            <Link
              href={path}
              css={{
                fontSize: '$4',
                lineHeight: '$shorter',
                alignSelf: 'center',
                color: '$text',
                display: 'flex',
                alignItems: 'center',
                ml: '$lg',
                cursor: 'pointer',
              }}
            >
              <ArrowBackIcon />
              Back to Vaults
            </Link>
          </Box>
          <Box
            css={{
              textTransform: 'capitalize',
              fontSize: '$7',
              lineHeight: '$shorter',
              fontWeight: '$bold',
              color: '$text',
            }}
          >
            {message}
          </Box>
          <Box css={{ minWidth: '15%' }}></Box>
        </Box>
      </Panel>
    </Box>
  );
}

export default ShowMessage;
