import { ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from 'stitches.config';

const StyledContainer = styled(ToastifyContainer, {
  '.Toastify__toast': {
    background: '$formInputBackground',
    borderRadius: '9px',
    border: '1px solid $formInputBackground',
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
  '.Toastify__toast--default': {},
  '.Toastify__toast--success': {
    borderColor: '$successColor',
  },
  '.Toastify__toast--error': {
    borderColor: '$errorColor',
  },
  '.Toastify__toast--success *': {
    color: 'var(--toastify-text-color-success)',
  },
  '.Toastify__toast--error *': {
    color: 'var(--toastify-text-color-error)',
  },
  '.Toastify__toast--default *': {
    color: 'var(--colors-text)',
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
