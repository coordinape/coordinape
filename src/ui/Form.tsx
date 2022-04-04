import { styled } from 'stitches.config';
export const Form = styled('form', {
  variants: {
    nominate: {
      true: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 8,
        padding: '0 0 $lg',
        overflowY: 'auto',
        maxHeight: '100vh',
        maxWidth: '648px',
      },
    },
  },
});
