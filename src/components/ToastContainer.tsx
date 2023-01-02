import { ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from 'stitches.config';

const StyledContainer = styled(ToastifyContainer, {
  '.Toastify__toast': {
    background: '$formInputBackground',
    borderRadius: '9px',
    border: '1px solid',
    minWidth: '400px',
    maxWidth: '640px',
    width: '80%',
  },
  '.Toastify__progress-bar': {
    height: '1px',
  },
  '.Toastify__toast--info': {
    borderColor: '$formInputBorder',
  },
  '.Toastify__toast--success': {
    borderColor: '$successColor',
  },
  '.Toastify__toast--error': {
    borderColor: '$errorIconBackground',
  },
  '.Toastify__toast--success *': {
    color: 'var(--toastify-text-color-success)',
  },
  '.Toastify__toast--error *': {
    color: 'var(--toastify-text-color-error)',
  },
  '.Toastify__toast--info *': {
    color: 'var(--colors-text)',
  },
});

export const ToastContainer = () => {
  return (
    <StyledContainer
      position="bottom-left"
      hideProgressBar={false}
      autoClose={1500}
      newestOnTop
      pauseOnFocusLoss
      draggable
      limit={3}
      pauseOnHover
    />
  );
};
