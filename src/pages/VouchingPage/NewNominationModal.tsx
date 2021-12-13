import React, { useState } from 'react';

import { ethers } from 'ethers';

import { makeStyles } from '@material-ui/core';

import { FormModal, ApeTextField } from 'components';
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

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
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

  const isAddress = ethers.utils.isAddress(address);
  const nominateChanged =
    name.length == 0 || description.length == 0 || isAddress;

  const onChangeWith =
    (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      set(e.target.value);

  const onSubmit = async () => {
    if (!nominateChanged) {
      throw 'Submit called when form not ready.';
    }
    nominateUser({
      name,
      address,
      description,
    })
      .then(() => {
        onClose();
      })
      .catch(console.warn);
  };

  return (
    <FormModal
      title="Nominate New Member"
      submitDisabled={!nominateChanged}
      onSubmit={onSubmit}
      submitText="Nominate Member"
      open={visible}
      onClose={onClose}
      size="small"
    >
      <p className={classes.description}>{nominateDescription}</p>
      <div className={classes.quadGrid}>
        <ApeTextField
          label="Name"
          value={name}
          onChange={onChangeWith(setName)}
          fullWidth
        />
        <ApeTextField
          label="ETH Address"
          value={address}
          onChange={onChangeWith(setAddress)}
          error={address.length > 0 && !isAddress}
          fullWidth
        />
        <ApeTextField
          label="Why are you nominating this person?"
          placeholder="Tell us why the person should be added to the circle, such as what they have achieved or what they will do in the future."
          value={description}
          className={classes.gridAllColumns}
          onChange={onChangeWith(setDescription)}
          multiline
          rows={4}
          inputProps={{
            maxLength: 280,
          }}
          fullWidth
        />
      </div>
    </FormModal>
  );
};

export default NewNominationModal;
