import { CSS } from '../../stitches.config';
import { Box, Text, ArrowDiagonalIcon, Button } from '../../ui';

//#region Interfaces & Types

type BaseStyledComponents = {
  css?: CSS;
};

export interface ClaimCardProps extends BaseStyledComponents {
  epochInfo: EpochInfoSectionProps[];
  actionSection: ActionSectionProps;
  children?: React.ReactNode;
}

export interface EpochInfoSectionProps extends BaseStyledComponents {
  title: string;
  subTitle: string;
  giveInfo: string;
}

export interface ActionSectionProps extends BaseStyledComponents {
  actionText1: string;
  actionText2: string;
  onClaim?(): void;
  onViewHistory?(): void;
}

//#endregion Interfaces

//#region Molecules
export const EpochInfoSection: React.FC<EpochInfoSectionProps> = (
  props
): JSX.Element => {
  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$xs',
        ...props.css,
      }}
    >
      <Text
        css={{
          fontSize: '$5',
          color: '$neutralGrayDark',
          fontWeight: '$bold',
        }}
      >
        {props.title}
      </Text>
      <Text css={{ fontSize: '$3', color: '$gray400' }}>{props.subTitle}</Text>
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '$xs',
        }}
      >
        <ArrowDiagonalIcon
          data-testid="arrow-diagonal-icon"
          css={{ color: '$green' }}
          viewBox="0 0 10 10"
          size="sm"
        />
        <Text css={{ fontSize: '$3', color: '$lightText' }}>
          {props.giveInfo}
        </Text>
      </Box>
    </Box>
  );
};

export const ActionSection: React.FC<ActionSectionProps> = (
  props
): JSX.Element => (
  <Box
    css={{
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      ...props.css,
    }}
  >
    <Button
      data-testid="action-button-1"
      outlined
      css={{ width: '145px' }}
      onClick={props.onClaim}
      size="small"
      color="red"
    >
      {props.actionText1}
    </Button>
    <Button
      data-testid="action-button-2"
      outlined
      onClick={props.onViewHistory}
      css={{ width: '145px', ml: '$sm' }}
      size="small"
      color="gray"
    >
      {props.actionText2}
    </Button>
  </Box>
);

//#endregion Molecules

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
        <EpochInfoSection key={`epoch-info-${index}`} {...epoch} />
      ))}
    <ActionSection {...props.actionSection} />
  </Box>
);
//#endergion
