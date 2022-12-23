/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlattenedGQLError } from '../common-lib/errorHandling';
import { Button, Toast } from 'ui';
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

export const useToast = () => {
  // const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  return {
    enqueueToast: (message: string, content?: string) => {
      return <Toast title="tgoasty" content="This is a toast"></Toast>;
    },
  };
};
