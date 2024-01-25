import { default as ReactMarkdownPreview } from '@uiw/react-markdown-preview';

export const MarkdownPreviewOG = (
  props: React.ComponentProps<typeof ReactMarkdownPreview>
) => {
  return (
    <ReactMarkdownPreview
      className="markdownPreviewSimple"
      style={{ background: 'transparent', fontSize: 40 }}
      {...props}
      skipHtml={false}
      disableCopy
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
    />
  );
};
