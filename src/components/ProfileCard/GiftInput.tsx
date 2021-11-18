import { transparentize } from 'polished';

import { IconButton, makeStyles } from '@material-ui/core';

import { ApeTextField } from 'components';
import { PlusCircleIcon, MinusCircleIcon } from 'icons';

import { CardInfoText } from './CardInfoText';

import { TUpdateGift } from 'types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0, 0.5),
  },
  textField: {
    marginTop: theme.spacing(1.5),
    '& label': {
      height: 14,
      margin: theme.spacing(0, 0, 0.5),
      fontSize: 12,
      fontWeight: 'bold',
      color: 'rgba(81, 99, 105, 0.7)',
    },
  },
  tokenInputContainer: {
    height: 66,
    marginTop: theme.spacing(1.5),
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
  },
  noteTextarea: {
    '& textarea': {
      fontSize: 12,
      wordBreak: 'normal',
    },
    '&.MuiInputBase-root': {
      backgroundColor: transparentize(0.3, theme.colors.white),
      padding: theme.spacing(1.5, 0),
    },
  },
  spinButton: {
    '&:first-of-type': {
      paddingLeft: theme.spacing(1),
      paddingRight: 0,
    },
    '&:last-of-type': {
      paddingLeft: 0,
      paddingRight: theme.spacing(1),
    },
  },
  tokenInput: {
    '& input': {
      fontSize: 25,
    },
    '&.MuiInputBase-root': {
      backgroundColor: 'white',
    },
    width: 140,
    height: 36,
  },
}));

export const GiftInput = ({
  tokens,
  note,
  updateGift,
  tokenName,
}: {
  note: string;
  tokens?: number;
  updateGift: TUpdateGift;
  tokenName: string;
}) => {
  const classes = useStyles();

  const onChangeTokens = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    try {
      updateGift({ tokens: Number(value) });
    } catch (e) {
      console.warn('onChangeTokens: Not a number.');
    }
  };

  const onChangeNote = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => updateGift({ note: value });

  return (
    <div className={classes.root}>
      {tokens !== undefined ? (
        <ApeTextField
          label={`${tokenName} Allocated`}
          value={tokens}
          onChange={onChangeTokens}
          className={classes.textField}
          InputProps={{
            classes: {
              root: classes.tokenInput,
            },
            startAdornment: (
              <IconButton
                className={classes.spinButton}
                onClick={() => updateGift({ tokens: tokens - 1 })}
                disableRipple
              >
                <MinusCircleIcon />
              </IconButton>
            ),
            endAdornment: (
              <IconButton
                className={classes.spinButton}
                onClick={() => updateGift({ tokens: tokens + 1 })}
                disableRipple
              >
                <PlusCircleIcon />
              </IconButton>
            ),
          }}
          inputProps={{
            min: 0,
            type: 'number',
          }}
        />
      ) : (
        <CardInfoText
          tooltip={`This contributor opted out of receiving ${tokenName}. They are paid through other channels or are not currently active.`}
        >
          This contributor opted out of receiving {tokenName} this epoch.
        </CardInfoText>
      )}
      <ApeTextField
        label="Leave a Note"
        className={classes.textField}
        onChange={onChangeNote}
        placeholder="Thank you for..."
        value={note}
        multiline
        fullWidth
        rows={3}
        inputProps={{
          maxLength: 600,
        }}
        InputProps={{
          classes: {
            root: classes.noteTextarea,
          },
        }}
      />
    </div>
  );
};
