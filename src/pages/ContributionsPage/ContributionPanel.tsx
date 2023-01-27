import { Flex } from '../../ui';

export const ContributionPanel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Flex column css={{ gap: '$md', mt: '$lg' }}>
      {children}
    </Flex>
  );
};
