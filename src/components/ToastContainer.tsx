import { ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from 'stitches.config';

const StyledContainer = styled(ToastifyContainer, {
  '.Toastify__toast': {
    background: '$toastifyBackground',
    borderRadius: '9px',
    border: '1px solid',
    minWidth: '400px',
    maxWidth: '640px',
    width: '80%',
    '&:hover': {
      '.toastCloseButton *': {
        color: '$cta',
      },
    },
  },
  '.Toastify__toast-icon': {
    marginInlineEnd: '20px',
  },
  '.Toastify__progress-bar': {
    height: '1px',
  },
  '.Toastify__toast--default': {
    borderColor: '$toastifyBorderColorDefault',
  },
  '.Toastify__toast--success': {
    borderColor: '$toastifyBorderColorSuccess',
  },
  '.Toastify__toast--success *': {
    color: '$toastifyTextColorSuccess',
  },

  '.Toastify__toast--error': {
    borderColor: '$toastifyBorderColorError',
  },
  '.Toastify__toast--error *': {
    color: '$toastifyTextColorError',
  },
  '.Toastify__toast--default *': {
    color: '$toastifyTextColorDefault',
  },
});

export const ToastContainer = () => {
  return (
    <StyledContainer
      position="bottom-left"
      hideProgressBar={false}
      autoClose={5000}
      newestOnTop
      pauseOnFocusLoss
      draggable
      limit={3}
      pauseOnHover
      theme="light"
    />
  );
};
