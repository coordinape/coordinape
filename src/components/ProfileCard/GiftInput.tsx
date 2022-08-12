import { IconButton, makeStyles } from '@material-ui/core';

import { DeprecatedApeTextField } from 'components';
import { PlusCircleIcon, DeprecatedMinusCircleIcon } from 'icons';
import { Link } from 'ui';

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
    '& label': {
      color: 'rgba(81, 99, 105, 0.7)',
    },
  },
  noteTextField: {
    '& > div': {
      marginBottom: 0,
    },
    '& textarea': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  noteTextarea: {
    '& textarea': {
      fontSize: 12,
      wordBreak: 'normal',
    },
    '&.MuiInputBase-root': {
      backgroundColor: theme.colors.background,
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
      textAlign: 'center',
    },
    '&.MuiInputBase-root': {
      backgroundColor: 'white',
    },
    width: '100%',
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
        <DeprecatedApeTextField
          label={`${tokenName} Allocated`}
          value={tokens}
          onChange={onChangeTokens}
          // this prevents the numbers changing on scroll
          onWheel={e => e.target instanceof HTMLElement && e.target.blur()}
          className={classes.textField}
          InputProps={{
            classes: {
              root: classes.tokenInput,
            },
            startAdornment: (
              <IconButton
                data-testid="decrement"
                className={classes.spinButton}
                onClick={() => updateGift({ tokens: tokens - 1 })}
                disableRipple
              >
                <DeprecatedMinusCircleIcon />
              </IconButton>
            ),
            endAdornment: (
              <IconButton
                data-testid="increment"
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
      <DeprecatedApeTextField
        label="Leave a Note"
        infoTooltip={
          <>
            What contributions earned your GIVE? Be specific, give examples!{' '}
            <Link
              target="_blank"
              href="https://coordinape.com/post/giving-feedback-in-web3?utm_source=coordinape-app&utm_medium=tooltip&utm_campaign=givingfeedback"
            >
              Learn more about feedback here
            </Link>
          </>
        }
        className={[classes.textField, classes.noteTextField].join(' ')}
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
