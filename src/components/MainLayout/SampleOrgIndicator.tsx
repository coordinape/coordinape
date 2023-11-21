import { givePaths } from '../../routes/paths';
import { AppLink, Flex, Text } from '../../ui';

export const SampleOrgIndicator = () => (
  <Flex
    css={{
      backgroundColor: '$tagActiveBackground',
      py: '$md',
      justifyContent: 'center',
    }}
  >
    <Flex css={{ flex: 1, marginRight: 'auto', '@sm': { display: 'none' } }}>
      &nbsp;
    </Flex>
    <Text
      semibold
      color="active"
      css={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        '@sm': {
          fontSize: '$small',
          justifyContent: 'flex-start',
          pl: '$md',
        },
      }}
    >
      Sample Organization
    </Text>
    <Flex
      css={{
        flex: 1,
        marginLeft: 'auto',
        justifyContent: 'flex-end',
        pr: '$md',
      }}
    >
      <Text
        css={{
          color: '$tagActiveText',
        }}
        size="small"
      >
        Done Testing?
        <AppLink inlineLink to={givePaths.createCircle} css={{ ml: '$sm' }}>
          Create a Circle
        </AppLink>
      </Text>
    </Flex>
  </Flex>
);
