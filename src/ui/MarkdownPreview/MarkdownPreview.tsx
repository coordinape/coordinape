import ReactMarkdownPreview from '@uiw/react-markdown-preview';
import { styled } from 'stitches.config';

const StyledMarkdownPreview = styled(ReactMarkdownPreview, {
  border: '1px solid transparent',
  '&:focus': {
    borderColor: '$borderMedium',
    boxSizing: 'border-box',
  },
  borderRadius: '8px',

  p: '$sm',
  minHeight: 'calc($2xl * 2)',

  color: '$text',
  width: '100%',
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
