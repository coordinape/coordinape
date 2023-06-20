import { DateTime } from 'luxon';
import { useNavigate } from 'react-router';

import { paths } from 'routes/paths';
import { Button, Flex, Panel, Text } from 'ui';

import { artWidth, artWidthMobile } from './constants';
import { CoSoulButton } from './CoSoulButton';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;

export const CoSoulManagement = ({
  cosoul_data,
  onMint,
  address,
}: {
  cosoul_data: CoSoulData;
  onMint(): void;
  address: string;
}) => {
  const minted_date =
    cosoul_data.mintInfo?.created_at &&
    DateTime.fromISO(cosoul_data.mintInfo.created_at).toFormat('DD');
  const navigate = useNavigate();

  return (
    <Panel
      css={{
        justifyContent: 'space-between',
        borderColor: '$cta',
        width: '100%',
        minWidth: '180px',
        maxWidth: `${artWidth}`,
        pb: '$xl',
        mb: '$xl',
        gap: '$3xl',
        '@sm': {
          maxWidth: `${artWidthMobile}`,
          height: 'auto',
          gap: '$1xl',
        },
      }}
    >
      <Flex column css={{ gap: '$sm' }}>
        {minted_date && (
          <Text variant="label">CoSoul minted on {minted_date}</Text>
        )}
      </Flex>
      <Flex column css={{ gap: '$lg' }}>
        <Button
          size="large"
          color="cta"
          onClick={() => {
            navigate(paths.cosoulView(address));
          }}
        >
          View Your CoSoul
        </Button>
        <CoSoulButton onMint={onMint} />
      </Flex>
    </Panel>
  );
};
