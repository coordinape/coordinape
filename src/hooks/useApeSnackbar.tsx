/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'react-toastify';
import { string } from 'zod';

import { FlattenedGQLError } from '../common-lib/errorHandling';
import { Flex, Toast, Text, Avatar } from 'ui';
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

const ToastMsg = (msg: string) => {
  return (
    <Flex>
      <div className="notforgotten">
        <Toast title={msg} content="some onctent">
          <Avatar />
        </Toast>
      </div>
    </Flex>
  );
};

export const useApeSnackbar = () => {
  return {
    showInfo: (message: string) =>
      toast.info(ToastMsg(message), { autoClose: false, closeOnClick: false }),
    showError: (error: any) =>
      toast.error(displayError(error), {
        style: { border: '1px solid red' }, // variant: 'error',
        autoClose: false, // persist: true,
        // action: (snackbarId: SnackbarKey) => {
        //   return (
        //     <Button
        //       size="small"
        //       outlined
        //       css={{ color: '$white' }}
        //       onClick={() => closeSnackbar(snackbarId)}
        //     >
        //       Close
        //     </Button>
        //   );
        // },
      }),
  };
};
