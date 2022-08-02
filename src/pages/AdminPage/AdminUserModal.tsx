import { useMemo, useState } from 'react';

import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, DeprecatedFormTextField, ActionDialog } from 'components';
import isFeatureEnabled from 'config/features';
import AdminUserForm from 'forms/AdminUserForm';
import { useApiAdminCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import { CheckBox, Link, Text } from 'ui';
import { assertDef } from 'utils/tools';

import { IUser } from 'types';

const GIFT_CIRCLE_DOCS_URL =
  'https://docs.coordinape.com/info/documentation/gift_circle';

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
  paymentInput: {
    marginBottom: theme.spacing(3),
    '&.disabled': {
      opacity: 0.3,
      pointerEvents: 'none',
      '& span': { color: 'red' },
    },
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
        const hasOptOutChanged = isOptedOut !== !!params?.fixed_non_receiver;
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
          fixed_non_receiver: {
            value: fixedNonReceiverValue,
            onChange: fixedNonReceiverOnChange,
            ...fixed_non_receiver
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
            <DeprecatedFormTextField
              {...fields.address}
              label="Contributor ETH address"
              fullWidth
              className={classes.ethInput}
            />

            <div className={classes.twoColumn}>
              <DeprecatedFormTextField
                {...fields.name}
                label="Contributor Name"
              />
              <DeprecatedFormTextField
                {...fields.starting_tokens}
                type="number"
                placeholder="0"
                infoTooltip={
                  <>
                    The maximum amount of giving a user can allocate in an epoch{' '}
                    <Link href={GIFT_CIRCLE_DOCS_URL} target="_blank">
                      Learn More
                    </Link>
                  </>
                }
                label={`${selectedCircle.tokenName} Allotment`}
              />
            </div>
            {isFeatureEnabled('fixed_payments') && (
              <div>
                {selectedCircle.fixed_payment_token_type ? (
                  <DeprecatedFormTextField
                    {...fields.fixed_payment_amount}
                    label="Fixed Payment Amount"
                    type="number"
                    placeholder="0"
                    fullWidth
                  />
                ) : (
                  <DeprecatedFormTextField
                    fullWidth
                    onChange={() => {}}
                    label="Fixed Payment Amount"
                    disabled={true}
                    placeholder="CoVault owner must set asset type first"
                  />
                )}
                <pre>
                  <Text>
                    Edit Fixed Payment Token in{' '}
                    <NavLink to={paths.circleAdmin(circleId)}>
                      Circle Settings
                    </NavLink>
                  </Text>
                </pre>
              </div>
            )}
            <CheckBox
              {...fields.role}
              label="Grant Administrative Permissions"
              infoTooltip={
                <>
                  As a Circle Admin, you will be able to edit Circle Settings,
                  Edit Epoch settings, edit your users, and create new circles.{' '}
                  <Link
                    href="https://docs.coordinape.com/get-started/admin"
                    target="_blank"
                  >
                    Learn More
                  </Link>
                </>
              }
            />
            <CheckBox
              {...non_giver}
              value={!nonGiverValue}
              label={`Allow contributor to send ${selectedCircle.tokenName}`}
              onChange={v => nonGiverOnChange(!v)}
              infoTooltip={
                <>
                  Gives the member the ability to reward circle members with
                  giving.{' '}
                  <Link href={GIFT_CIRCLE_DOCS_URL} target="_blank">
                    Learn More
                  </Link>
                </>
              }
            />
            <CheckBox
              {...fixed_non_receiver}
              value={!fixedNonReceiverValue}
              onChange={v => fixedNonReceiverOnChange(!v)}
              label={`Allow contributor to receive ${
                selectedCircle.tokenName || 'GIVE'
              }`}
              infoTooltip={
                <>
                  Allows the Contributor to get paid based on the amount of
                  giving allocated by circle members.{' '}
                  <Link href={GIFT_CIRCLE_DOCS_URL} target="_blank">
                    Learn More
                  </Link>
                </>
              }
            />
          </div>
          <ActionDialog
            open={!hasAcceptedOptOutWarning && showOptOutChangeWarning}
            title={`This user has ${
              selectedCircle.tokenName || 'GIVE'
            } allocated.`}
            onPrimary={() => {
              setHasAcceptedOptOutWarning(true);
              setShowOptOutChangeWarning(false);
            }}
          >
            Changing their opt-in status will remove all{' '}
            {selectedCircle.tokenName || 'GIVE'} allocated to them. This cannot
            be undone.
          </ActionDialog>
        </FormModal>
      )}
    </AdminUserForm.FormController>
  );
};

export default AdminUserModal;
