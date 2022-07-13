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
      radioLabel: {
        lineHeight: '$short',
        color: '$text',
        fontSize: '$medium',
        fontFamily: 'Inter',
        fontWeight: '$normal',
        textAlign: 'center',
      },
      label: {
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        lineHeight: '$short',
        fontFamily: 'Inter',
        fontWeight: '$semibold',
      },
    },
  },
});

export default FormLabel;
