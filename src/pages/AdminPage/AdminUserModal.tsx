import { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField, ActionDialog } from 'components';
import { ApeCheckbox } from 'components/ApeCheckbox/ApeCheckbox';
import AdminUserForm from 'forms/AdminUserForm';
import { useApiAdminCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { assertDef } from 'utils/tools';

import { IUser } from 'types';

const GIFT_CIRCLE_DOCS_URL =
  'https://docs.coordinape.com/welcome/gift_circle#the-gift-circle';

const useStyles = makeStyles(theme => ({
  modalBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr',
    columnGap: theme.spacing(3),
    // rowGap: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  ethInput: {
    width: '100%',
    gridColumn: '1 / span 2',
  },
  helperBox: {
    height: 0,
  },
}));

export const AdminUserModal = ({
  user,
  onClose,
  open,
}: {
  user?: IUser;
  open?: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();

  const { circle: selectedCircle, circleId } = useSelectedCircle();
  const { updateUser, createUser } = useApiAdminCircle(circleId);

  const [showOptOutChangeWarning, setShowOptOutChangeWarning] = useState(false);
  const [hasAcceptedOptOutWarning, setHasAcceptedOptOutWarning] =
    useState(false);

  const isOptedOut = !!user?.fixed_non_receiver || !!user?.non_receiver;
  const hasGiveAllocated = !!user?.give_token_received;

  const source = useMemo(
    () => ({
      user: user,
      circle: assertDef(selectedCircle, 'Missing circle'),
    }),
    [user, selectedCircle]
  );

  return (
    <AdminUserForm.FormController
      source={source}
      hideFieldErrors
      submit={params => {
        const hasOptOutChanged =
          isOptedOut !==
          (!!params?.fixed_non_receiver || !!params?.non_receiver);
        const showWarning =
          hasOptOutChanged && hasGiveAllocated && !hasAcceptedOptOutWarning;

        if (showWarning) {
          setShowOptOutChangeWarning(true);
        } else {
          setShowOptOutChangeWarning(false);
          (user ? updateUser(user.address, params) : createUser(params))
            .then(() => onClose())
            .catch(console.warn);
        }
      }}
    >
      {({
        fields: {
          non_giver: {
            value: nonGiverValue,
            onChange: nonGiverOnChange,
            ...non_giver
          },
          ...fields
        },
        errors,
        changedOutput,
        handleSubmit,
      }) => (
        <FormModal
          onClose={onClose}
          open={open === undefined ? true : open}
          title={user ? `Edit ${user.name}` : 'Create User'}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          errors={errors}
          size="small"
        >
          <div>
            <FormTextField
              {...fields.address}
              label="Contributor ETH address"
              fullWidth
              className={classes.ethInput}
            />

            <div className={classes.twoColumn}>
              <FormTextField {...fields.name} label="Contributor Name" />
              <FormTextField
                {...fields.starting_tokens}
                type="number"
                infoTooltip={
                  <>
                    The maximum amount of giving a user can allocate in an epoch
                    <a
                      href={GIFT_CIRCLE_DOCS_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {' '}
                      Learn More
                    </a>
                  </>
                }
                label="GIVE Allotment"
              />
            </div>

            <ApeCheckbox
              {...fields.role}
              label="Grant Administrative Permissions"
              infoTooltip={
                <>
                  As a Circle Admin, you will be able to edit Circle Settings,
                  Edit Epoch settings, edit your users, and create new circles.
                  <a
                    href="https://docs.coordinape.com/welcome/admin_info"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    Learn More
                  </a>
                </>
              }
            />
            <ApeCheckbox
              {...non_giver}
              value={!nonGiverValue}
              label="Allow contributor to give tokens"
              onChange={v => nonGiverOnChange(!v)}
              infoTooltip={
                <>
                  Allows the Contributor to get paid based on the amount of
                  giving allocated by circle members.
                  <a
                    href={GIFT_CIRCLE_DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    Learn More
                  </a>
                </>
              }
            />
            <ApeCheckbox
              {...fields.non_receiver}
              label="Allow contributor to receive tokens"
              disabled={fields.fixed_non_receiver.value}
              infoTooltip={
                <>
                  Gives the member the ability to reward circle members with
                  giving.
                  <a
                    href={GIFT_CIRCLE_DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    Learn More
                  </a>
                </>
              }
            />
          </div>

          <ActionDialog
            open={!hasAcceptedOptOutWarning && showOptOutChangeWarning}
            title="This user has GIVE allocated."
            onPrimary={() => {
              setHasAcceptedOptOutWarning(true);
              setShowOptOutChangeWarning(false);
            }}
          >
            Changing their opt-in status will remove all GIVE allocated to them.
            This cannot be undone.
          </ActionDialog>
        </FormModal>
      )}
    </AdminUserForm.FormController>
  );
};

export default AdminUserModal;
