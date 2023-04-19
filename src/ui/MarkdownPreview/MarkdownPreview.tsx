import ReactMarkdownPreview from '@uiw/react-markdown-preview';
import { ThemeContext } from 'features/theming/ThemeProvider';
import { styled } from 'stitches.config';

const StyledMarkdownPreview = styled(ReactMarkdownPreview, {
  fontFamily: '$display !important',
  border: '1px solid $border',
  borderRadius: '$3',
  p: '$sm',
  minHeight: 'calc($2xl * 2)',
  cursor: 'pointer',
  color: '$text !important',
  width: '100%',
  background: 'transparent !important',
  // background: '$surfaceNested !important',
  'h1, h2, h3, h4, h5': {
    borderBottom: 'none !important',
    mt: '$md !important',
    pt: '0 !important',
    fontSize: '$large !important',
  },
  img: {
    display: 'block',
    maxHeight: '850px',
  },
  'h1, h2, h3, h4, h5, p': {
    mb: '0 !important',
    pb: '$sm !important',
    lineHeight: '$shorter',
  },
  'pre, code': {
    background: '$surfaceNested !important',
    '*': {
      fontFamily:
        "Consolas, 'Liberation Mono', Menlo, Courier, monospace !important",
    },
  },
  '.copied': {},
  variants: {
    display: {
      true: {
        cursor: 'default',
        borderColor: 'transparent',
        backgroundColor: '$dim !important',
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
        borderColor: 'transparent',
      },
    },
  },
});

export const MarkdownPreview = (
  props: React.ComponentProps<typeof StyledMarkdownPreview>
) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <StyledMarkdownPreview
          {...props}
          skipHtml={false}
          disableCopy
          linkTarget="_blank"
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
            'data-color-mode': theme === 'light' ? 'light' : 'dark',
          }}
        />
      )}
    </ThemeContext.Consumer>
  );
};
