import { useSnackbar } from 'notistack';

const defaultErrorMessage = 'Something went wrong.';

const displayError = (error: any) => {
  if (!error) return defaultErrorMessage;
  if (typeof error === 'string') return error;
  const data = error.response?.data;

  // when a form submission has validation errors, Laravel responds with:
  // {
  //   "message": "The given data was invalid.",
  //   "errors": {"address": ["The address has already been taken."]}
  // }
  //
  // and we want to show the specific error messages
  if (data?.errors) return Object.values(data?.errors).join(' ');

  return data?.message || error.message || defaultErrorMessage;
};

export const useApeSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const showInfo = (message: string) =>
    enqueueSnackbar(message, { variant: 'default' });
  const showError = (error: any) =>
    enqueueSnackbar(displayError(error), { variant: 'error' });
  return {
    showInfo,
    showError,
    apeInfo: showInfo,
    apeError: showError,
  };
};
