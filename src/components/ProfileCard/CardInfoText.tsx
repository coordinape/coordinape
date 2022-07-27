import { ApeInfoTooltip } from 'components';
import { Flex, Text } from 'ui';

export const CardInfoText = ({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactNode;
}) => {
  return (
    <Flex column css={{ alignItems: 'center' }}>
      {tooltip && <ApeInfoTooltip>{tooltip}</ApeInfoTooltip>}
      <Text size="small" css={{ textAlign: 'center', mx: '$xl', mb: '$lg' }}>
        {children}
      </Text>
    </Flex>
  );
};
