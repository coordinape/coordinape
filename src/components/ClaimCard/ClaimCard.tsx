import { CSS } from '../../stitches.config';
import { Box, Text, Button, ArrowDownLeftIcon } from '../../ui';

//#region Interfaces & Types

type BaseStyledComponents = {
  css?: CSS;
};

type EpochInfo = {
  title: string;
  subTitle: string;
  giveInfo: string;
};

export interface ClaimCardProps extends BaseStyledComponents {
  epochInfo: EpochInfo[];
  claimAmount: string | number;
  onClaim?(): void;
  onViewHistory?(): void;
  children?: React.ReactNode;
}

//#endregion Interfaces

//#region Organisms
export const ClaimCard: React.FC<ClaimCardProps> = (props): JSX.Element => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: '327px',
      padding: '$md',
      gap: '$md',
      borderRadius: '$1',
      backgroundColor: 'white',
      ...props.css,
    }}
  >
    {props.epochInfo &&
      props.epochInfo.map((epoch, index) => (
        <Box
          key={`epoch-info-${index}`}
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '$xs',
          }}
        >
          <Text
            css={{
              fontSize: '$5',
              color: '$neutralGrayDark',
              fontWeight: '$bold',
            }}
          >
            {epoch.title}
          </Text>
          <Text css={{ fontSize: '$3', color: '$gray400' }}>
            {epoch.subTitle}
          </Text>
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: '$xs',
            }}
          >
            <ArrowDownLeftIcon
              color="darkRed"
              data-testid="arrow-diagonal-icon"
            />
            <Text css={{ fontSize: '$3', color: '$lightText' }}>
              {epoch.giveInfo}
            </Text>
          </Box>
        </Box>
      ))}
    <Box
      css={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gap: '$sm',
      }}
    >
      <Button
        data-testid="action-button-1"
        outlined
        onClick={props.onClaim}
        size="small"
        color="red"
      >
        Claim {props.claimAmount} USDC
      </Button>
      <Button
        data-testid="action-button-2"
        outlined
        onClick={props.onViewHistory}
        size="small"
        color="gray"
      >
        View History
      </Button>
    </Box>
  </Box>
);
//#endregion
