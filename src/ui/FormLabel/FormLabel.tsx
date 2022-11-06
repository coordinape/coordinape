import { styled } from '../../stitches.config';

const COMPOSERS = {
  variants: {
    type: {
      textField: {
        lineHeight: '$short',
        color: '$text',
        fontSize: '$small',
        fontWeight: '$bold',
        mb: '$sm',
      },
      radioLabel: {
        lineHeight: '$short',
        color: '$text',
        fontSize: '$medium',
        fontWeight: '$normal',
      },
      label: {
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        lineHeight: '$shorter',
        fontWeight: '$bold',
        display: 'flex',
        gap: '$xs',
      },
    },
  },
};

export const FormLabel = styled('label', COMPOSERS);

export type FormLabelVariant = keyof typeof COMPOSERS['variants']['type'];

export default FormLabel;
