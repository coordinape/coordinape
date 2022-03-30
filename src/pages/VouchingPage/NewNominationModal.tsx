import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField } from 'components';
import NewNominateForm from 'forms/NewNominateForm';
import { useApiWithSelectedCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';

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

  return (
    <NewNominateForm.FormController
      source={undefined}
      hideFieldErrors
      submit={params => nominateUser(params).then(onClose).catch(console.warn)}
    >
      {({ fields, errors, changedOutput, handleSubmit }) => (
        <FormModal
          title="Nominate New Member"
          submitDisabled={!changedOutput}
          onSubmit={handleSubmit}
          submitText="Nominate Member"
          open={visible}
          onClose={onClose}
          errors={errors}
          size="small"
        >
          <p className={classes.description}>{nominateDescription}</p>
          <div className={classes.quadGrid}>
            <FormTextField label="Name" {...fields.name} fullWidth />
            <FormTextField label="ETH Address" {...fields.address} fullWidth />
            <FormTextField
              label="Why are you nominating this person?"
              placeholder="Tell us why the person should be added to the circle, such as what they have achieved or what they will do in the future."
              {...fields.description}
              multiline
              rows={4}
              inputProps={{
                maxLength: 280,
              }}
              className={classes.gridAllColumns}
              fullWidth
            />
          </div>
        </FormModal>
      )}
    </NewNominateForm.FormController>
  );
};

export default NewNominationModal;
