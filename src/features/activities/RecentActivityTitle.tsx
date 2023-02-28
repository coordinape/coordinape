import { Flex, Text } from '../../ui';

export const RecentActivityTitle = () => {
  return (
    <Flex
      css={{
        borderBottom: '1px solid $dim',
        width: '100%',
        pb: '$sm',
        mb: '$md',
        justifyContent: 'flex-start',
      }}
    >
      <Text h2>Recent Activity</Text>
    </Flex>
  );
};
