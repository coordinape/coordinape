import { CSS } from '../../stitches.config';
import { Box, Text, Button, ArrowDownLeftIcon } from '../../ui';

//#region Interfaces & Types

type EpochInfo = {
  title: string;
  subTitle: string;
  giveInfo: string;
};

export interface ClaimCardProps {
  epochInfo: EpochInfo[];
  claimAmount: string | number;
  onClaim?(): void;
  onViewHistory?(): void;
  css?: CSS;
}

//#endregion Interfaces

//#region Organisms
export const ClaimCard: React.FC<ClaimCardProps> = (props): JSX.Element => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'column',
      width: '327px',
      '@xs': {
        width: '100%',
      },
      padding: '$md',
      gap: '$md',
      borderRadius: '$1',
      backgroundColor: 'white',
      ...props.css,
    }}
  >
    {props.epochInfo.map((epoch, index) => (
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
            fontSize: '$medium',
            color: '$text',
            fontWeight: '$bold',
          }}
        >
          {epoch.title}
        </Text>
        <Text css={{ fontSize: '$small', color: '$secondaryText' }}>
          {epoch.subTitle}
        </Text>
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '$xs',
          }}
        >
          <ArrowDownLeftIcon data-testid="arrow-diagonal-icon" />
          <Text css={{ fontSize: '$small', color: '$secondaryText' }}>
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
        color="primary"
      >
        Claim {props.claimAmount} USDC
      </Button>
      <Button
        data-testid="action-button-2"
        outlined
        onClick={props.onViewHistory}
        size="small"
        color="neutral"
      >
        View History
      </Button>
    </Box>
  </Box>
);
//#endregion
