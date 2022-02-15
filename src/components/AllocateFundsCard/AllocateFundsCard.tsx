import { CSS } from '../../stitches.config';
import { Box, Text, Button } from '../../ui';
import { TextField } from 'ui/TextField/TextField';

//#region Interfaces & Types

export interface AllocateFundsCardProps {
  title: string;
  epoch: string;
  period: string;
  css?: CSS;
}

//#endregion Interfaces

//#region Organisms
export const AllocateFundsCard: React.FC<AllocateFundsCardProps> = (
  props
): JSX.Element => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'column',
      width: '550px',
      height: '492px',
      gap: '$md',
      borderRadius: '$1',
      backgroundColor: 'white',
      ...props.css,
    }}
  >
    <Text
      css={{
        fontSize: '$5',
        color: '$text',
        fontWeight: '$light',
      }}
    >
      Edit allowances for
    </Text>
    <Text
      css={{
        fontSize: '30px',
        color: '$text',
        fontWeight: '$bold',
      }}
    >
      {props.epoch}
    </Text>
    <Text
      css={{
        fontSize: '$8',
        color: '$lightBlue',
        fontWeight: '$normal',
      }}
    >
      {props.period}
    </Text>
    <Text
      css={{
        fontSize: '$4',
        color: '$lightBlue',
        fontWeight: '$light',
      }}
    >
      (Repeats Monthly)
    </Text>
    <Box>
      <Text
        css={{
          fontSize: '$2',
          color: '$text',
          fontWeight: '$light',
        }}
      ></Text>
      <TextField variant="fund" />
    </Box>
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
