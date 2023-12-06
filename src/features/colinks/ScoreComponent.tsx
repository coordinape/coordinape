import { coLinksPaths } from '../../routes/paths';
import { AppLink, Flex, Panel, Text } from '../../ui';

export const ScoreComponent = ({
  label,
  score,
  address,
}: {
  label: string;
  score: number;
  address: string;
}) => {
  return (
    <Panel as={AppLink} to={coLinksPaths.score(address)} noBorder>
      <Flex column>
        <Text
          semibold
          size={'large'}
          color={'cta'}
          css={{ justifyContent: 'flex-end' }}
        >
          {score}
        </Text>
        <Text
          color={'default'}
          semibold
          size={'small'}
          css={{ justifyContent: 'flex-end' }}
        >
          {label}
        </Text>
      </Flex>
    </Panel>
  );
};
