import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';

import { useVaultFactory } from '../../hooks/useVaultFactory';
import { FormModal, FormAssetSelector } from 'components';
import CreateVaultForm from 'forms/CreateVaultForm';

export const CreateVaultModal = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const history = useHistory();
  const { chainId } = useWeb3React();
  const { createApeVault } = useVaultFactory();

  return (
    <CreateVaultForm.FormController
      source={chainId}
      hideFieldErrors
      submit={async params =>
        createApeVault(params).then(vault => {
          // eslint-disable-next-line no-console
          console.log('created vault:', vault);
          history.push('/admin/vaults');
        })
      }
    >
      {({ fields, handleSubmit, ready, errors }) => (
        <FormModal
          onClose={onClose}
          open={open}
          title={'Create a New Vault'}
          subtitle={'We need to have some short description here'}
          onSubmit={handleSubmit}
          submitDisabled={!ready}
          size="small"
          submitText="Mint Vault"
        >
          <FormAssetSelector
            label="Select an asset"
            subLabel="This will be the asset you distribute from the vault"
            infoTooltip="TODO: Ask someone to write this"
            {...fields.asset}
          />
          {/* TODO: Improve Errors, remove hideFieldErrors and implement in 
                    FormAssetSelector? But then the paths would need to be
                    set to 'asset' so all errors go there */}
          {Object.entries(errors).map(([key, value]) => (
            <span key={key}>
              {key} - {value}
            </span>
          ))}
        </FormModal>
      )}
    </CreateVaultForm.FormController>
  );
};

export default CreateVaultModal;
