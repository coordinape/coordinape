import { SnackbarKey, useSnackbar } from 'notistack';

import { FlattenedGQLError } from '../common-lib/errorHandling';
import { Button } from 'ui';
import { normalizeError } from 'utils/reporting';

const defaultErrorMessage = 'Something went wrong.';

const displayError = (error: any) => {
  if (!error) return defaultErrorMessage;
  if (typeof error === 'string') return error;
  const data = error.response?.data;
  error = normalizeError(error);

  if (error instanceof FlattenedGQLError) {
    return error.userDisplayableString();
  }

  return data?.message || error.message || defaultErrorMessage;
};

export const useApeSnackbar = () => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  return {
    showInfo: (message: string) =>
      enqueueSnackbar(message, { variant: 'info' }),
    showError: (error: any) =>
      enqueueSnackbar(displayError(error), {
        variant: 'error',
        persist: true,
        action: (snackbarId: SnackbarKey) => {
          return (
            <Button
              size="small"
              outlined
              css={{ color: '$white' }}
              onClick={() => closeSnackbar(snackbarId)}
            >
              Close
            </Button>
          );
        },
      }),
  };
};
