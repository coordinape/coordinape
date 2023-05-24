import isFeatureEnabled from 'config/features';
import { Text } from 'ui';

export const ViewPage = () => {
  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <>
      <Text color="cta" h1>
        test
      </Text>
    </>
  );
};
