import { useSnackbar } from 'notistack';

export const useApeSnackbar = (): {
  apeInfo: (message: string) => void;
  apeError: (error: any) => void;
} => {
  const { enqueueSnackbar } = useSnackbar();
  return {
    apeInfo: (message: string) =>
      enqueueSnackbar(message, { variant: 'default' }),
    apeError: (error: any) =>
      enqueueSnackbar(
        typeof error === 'string'
          ? error
          : error?.response?.data?.message ||
              error?.message ||
              'Something went wrong!',
        { variant: 'error' }
      ),
  };
};
