import clsx from 'clsx';
import { ethers } from 'ethers';
import isEmpty from 'lodash/isEmpty';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { Modal, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { FormTextField } from 'components';
import { useApiWithSelectedCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { Form, Button } from 'ui';

const useStyles = makeStyles(theme => ({
  description: {
    marginTop: theme.spacing(1),
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  quadGrid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto',
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(4),
  },
  gridAllColumns: {
    gridColumn: '1/-1',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    color: theme.colors.mediumGray,
    top: 0,
    right: 0,
    position: 'absolute',
  },
  body: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    padding: theme.spacing(0, 8, 3),
    overflowY: 'auto',
    maxHeight: '100vh',
  },
  large: {
    maxWidth: 1140,
    padding: theme.spacing(0, 12, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 6, 3),
    },
  },
  medium: {
    maxWidth: 820,
  },
  small: {
    maxWidth: 648,
  },
  title: {
    margin: theme.spacing(3, 0, 2),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    margin: theme.spacing(0, 0, 2),
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errors: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
    minHeight: 45,
    color: theme.colors.red,
  },
}));

export const NewNominationModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { circle } = useSelectedCircle();
  const { nominateUser } = useApiWithSelectedCircle();

  const nominateDescription = circle
    ? `The ${circle.name} Circle requires ${
        circle.min_vouches
      } people total to vouch for a new member and nominations are live for ${
        circle.nomination_days_limit
      } ${(circle.nomination_days_limit || 0) > 1 ? 'days' : 'day'}. ${
        (circle.min_vouches || 0) > 2
          ? `If a nomination does not receive ${
              circle.min_vouches - 1
            } additional ${
              circle.min_vouches > 3 ? 'vouches' : 'vouch'
            } in that period, the nomination fails.`
          : ''
      }`
    : '';
  type NominateFormValues = {
    name: string;
    address: string;
    description: string;
  };
  const intialValues = {
    name: '',
    address: '',
    description: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NominateFormValues>({ mode: 'all' });

  const onSubmit: SubmitHandler<NominateFormValues> = async data => {
    nominateUser({
      ...data,
    })
      .then(() => {
        onClose();
      })
      .catch(console.warn);
  };
  console.log(errors);
  return (
    <Modal
      title="Nominate New Member"
      open={visible}
      onClose={onClose}
      className={classes.modal}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx([classes['small']], classes.body)}
      >
        <IconButton
          className={classes.closeButton}
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <h3 className={classes.title}>{'Nominate New Member'}</h3>
        <p className={classes.description}>{nominateDescription}</p>
        <div className={classes.quadGrid}>
          <Controller
            name={'name'}
            defaultValue={intialValues.name}
            rules={{
              required: 'Name must be at least 3 characters long.',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters long.',
              },
            }}
            control={control}
            render={({ field }) => (
              <FormTextField label="Name" {...field} fullWidth />
            )}
          />
          <Controller
            name={'address'}
            defaultValue={intialValues.address}
            control={control}
            rules={{
              validate: value =>
                ethers.utils.isAddress(value) || 'Invalid address',
            }}
            render={({ field }) => (
              <FormTextField label="ETH Address" {...field} fullWidth />
            )}
          />
          <Controller
            name={'description'}
            defaultValue={intialValues.description}
            control={control}
            rules={{
              required: 'Description must be at least 40 characters long.',
              minLength: {
                value: 40,
                message: 'Description must be at least 40 characters long.',
              },
            }}
            render={({ field }) => (
              <FormTextField
                label="Why are you nominating this person?"
                placeholder="Tell us why the person should be added to the circle, such as what they have achieved or what they will do in the future."
                {...field}
                multiline
                rows={4}
                inputProps={{
                  maxLength: 280,
                }}
                fullWidth
              />
            )}
          />
        </div>
        {!isEmpty(errors) && (
          <div className={classes.errors}>
            {Object.values(errors).map((error, i) => (
              <div key={i}>{error.message}</div>
            ))}
          </div>
        )}
        <Button
          css={{ mt: '$lg', gap: '$xs' }}
          color="red"
          size="medium"
          type="submit"
        >
          Nominate Member
        </Button>
      </Form>
    </Modal>
  );
};

export default NewNominationModal;
