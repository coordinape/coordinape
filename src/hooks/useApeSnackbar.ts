import { useSnackbar } from 'notistack';

export const useApeSnackbar = (): {
  apeInfo: (message: string) => void;
} => {
  const { enqueueSnackbar } = useSnackbar();
  return {
    apeInfo: (message: string) =>
      enqueueSnackbar(message, { variant: 'default' }),
  };
};
