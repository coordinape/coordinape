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
    <Panel as={AppLink} to={coLinksPaths.profileReputation(address)} noBorder>
      <Flex column>
        <Text semibold size={'large'} color={'cta'}>
          {score}
        </Text>
        <Text
          color={'default'}
          semibold
          size={'small'}
          css={{ whiteSpace: 'nowrap' }}
        >
          {label}
        </Text>
      </Flex>
    </Panel>
  );
};
