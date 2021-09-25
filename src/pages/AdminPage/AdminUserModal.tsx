import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField, ApeToggle } from 'components';
import AdminUserForm from 'forms/AdminUserForm';
import { useAdminApi } from 'hooks';
import { useSelectedCircle } from 'recoilState';
import { assertDef } from 'utils/tools';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  modalBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  ethInput: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
}));

export const AdminUserModal = ({
  user,
  onClose,
  open,
}: {
  user?: IUser;
  open: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();

  const selectedCircle = useSelectedCircle();

  const { updateUser, createUser } = useAdminApi();

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
      submit={(params) =>
        (user
          ? updateUser(user.address, params)
          : createUser(params)
        ).then(() => onClose())
      }
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
          open={open}
          title={user ? `Edit ${user.name}` : 'Create User'}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          errors={errors}
          size="small"
        >
          <div className={classes.twoColumn}>
            <FormTextField {...fields.name} label="Contributor Name" />
            <ApeToggle {...fields.role} label="Are They Admin?" />
            <FormTextField
              {...fields.starting_tokens}
              type="number"
              label="Starting Tokens"
            />
            <ApeToggle
              {...non_giver}
              onChange={(v) => nonGiverOnChange(!v)}
              value={!nonGiverValue}
              label="Can Give?"
            />
            <ApeToggle {...fields.fixed_non_receiver} label="Force Opt'd Out" />
            <ApeToggle
              {...fields.non_receiver}
              disabled={fields.fixed_non_receiver.value}
              label="Opt'd Out"
            />
          </div>
          <FormTextField
            {...fields.address}
            label="Contributor ETH address"
            fullWidth
            className={classes.ethInput}
          />
        </FormModal>
      )}
    </AdminUserForm.FormController>
  );
};

export default AdminUserModal;
