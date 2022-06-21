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
      label: {
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        fontFamily: 'Inter',
        fontWeight: '$semibold',
      },
    },
  },
});

export default FormLabel;
