// TODO(crabsinger) cleanup and remove isFeatureEnabled

import { ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from 'stitches.config';

import { isFeatureEnabled } from 'config/features';

const themeEnabled = !!isFeatureEnabled('theme_switcher');

const StyledContainer = styled(ToastifyContainer, {
  '&.Toastify__toast-container': {
    pointerEvents: 'auto',
    width: '80%',
    minWidth: '400px',
    maxWidth: '660px',
  },

  '.Toastify__toast': {
    background: '$toastifyBackground',
    borderRadius: '9px',
    border: '1px solid',
    '.toastCloseButton svg': {
      transition: 'transform 0.3s ease-in-out',
    },
    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      toastCloseButton: {
        background: 'transparent',
      },
      '.toastCloseButton svg': {
        transform: 'rotate(90deg)',
      },
    },
    '.toastContent': {
      '&:hover': {
        svg: {
          opacity: '0.5',
          transition: 'transform 0.3s',
        },
      },
    },
  },
  '.Toastify__toast-icon': {
    mr: '20px',
  },
  '.Toastify__progress-bar': {
    height: '1px',
  },
  '.Toastify__toast--default': {
    borderColor: 'transparent',
    '.Toastify__toast-icon': {
      width: themeEnabled && '$2xl',
      m: themeEnabled && '0 -3px 0 -5px',
    },
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
      closeOnClick={false}
      pauseOnFocusLoss
      draggable
      limit={3}
      pauseOnHover
      theme="light"
    />
  );
};
