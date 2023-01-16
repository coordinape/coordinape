import ReactMarkdownPreview from '@uiw/react-markdown-preview';
import { styled } from 'stitches.config';

const StyledMarkdownPreview = styled(ReactMarkdownPreview, {
  fontFamily: '$display !important',
  border: '1px solid transparent',
  borderRadius: '$3',
  p: '$sm',
  minHeight: 'calc($2xl * 2)',
  cursor: 'pointer',
  color: '$text !important',
  width: '100%',
  'h1, h2, h3, h4, h5': {
    borderBottom: 'none !important',
    mt: '$md !important',
    pt: '0 !important',
    fontSize: '$large !important',
  },
  'h1, h2, h3, h4, h5, p': {
    mb: '0 !important',
    pb: '$sm !important',
    lineHeight: '$shorter',
  },
  variants: {
    display: {
      true: {
        cursor: 'default',
        backgroundColor: 'transparent !important',
        borderColor: '$border !important',
        minHeight: 0,
        borderRadius: '$1',
        p: '$md',
      },
    },
    render: {
      true: {
        backgroundColor: 'transparent !important',
        minHeight: 0,
        p: 0,
        borderRadius: 0,
      },
    },
  },
});

export const MarkdownPreview = (
  props: React.ComponentProps<typeof StyledMarkdownPreview>
) => {
  return (
    <StyledMarkdownPreview
      {...props}
      skipHtml={false}
      rehypeRewrite={(node, index, parent) => {
        if (
          node.type === 'element' &&
          node.tagName &&
          node.tagName === 'a' &&
          parent &&
          parent.type === 'element' &&
          /^h(1|2|3|4|5|6)/.test(parent.tagName)
        ) {
          parent.children = parent.children.slice(1);
        }
      }}
      warpperElement={{
        'data-color-mode': 'light',
      }}
    />
  );
};
