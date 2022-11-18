import { Flex, Text } from '../../ui';

export const SampleOrgIndicator = () => (
  <Flex
    css={{
      backgroundColor: '$active',
      py: '$md',
      justifyContent: 'center',
    }}
  >
    <Text
      semibold
      color="active"
      css={{
        '@sm': {
          fontSize: '$small',
        },
      }}
    >
      Sample Organization
    </Text>
  </Flex>
);
