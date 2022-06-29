import { styled } from '../../stitches.config';

export const FormLabel = styled('label', {
  variants: {
    type: {
      textField: {
        lineHeight: '$short',
        color: '$text',
        fontSize: '$1',
        fontFamily: 'Inter',
        fontWeight: '$bold',
        textAlign: 'center',
        mb: '$sm',
      },
    },
  },
});

export default FormLabel;
