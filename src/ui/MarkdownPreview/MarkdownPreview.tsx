import { default as ReactMarkdownPreview } from '@uiw/react-markdown-preview';
import { ThemeContext } from 'features/theming/ThemeProvider';
import { useNavigate } from 'react-router';
import { styled } from 'stitches.config';

import { webAppURL } from '../../config/webAppURL';
import { textAreaMinHeight } from 'components/FormInputField';

const StyledMarkdownPreview = styled(ReactMarkdownPreview, {
  fontFamily: '$display !important',
  border: '1px solid $border',
  borderRadius: '$3',
  p: '$sm',
  minHeight: textAreaMinHeight,
  cursor: 'pointer',
  color: '$text !important',
  width: '100%',
  background: 'transparent !important',
  overflowWrap: 'anywhere',
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '&::before, &::after': {
    display: 'none !important',
  },
  'h1, h2, h3, h4, h5': {
    borderBottom: 'none !important',
    mt: '$md !important',
    pt: '0 !important',
    fontSize: '$large !important',
  },
  table: {
    overflow: 'auto',
    'th, tr, td': {
      fontSize: '$small',
      backgroundColor: 'transparent !important',
      textAlign: 'left',
      border: 'none !important',
      borderBottom: '0.5px solid $border !important',
      pl: '$sm !important',
      pr: 'md !important',
    },
    'tbody tr': {
      '&:hover': {
        td: {
          backgroundColor: '$surfaceNested !important',
        },
      },
    },
  },
  img: {
    display: 'block',
    maxHeight: '850px',
    my: '$xs',
  },
  'h1, h2, h3, h4, h5, p, ul, ol': {
    mb: '0 !important',
    pb: '$sm !important',
    lineHeight: '$short',
  },
  ul: {
    pt: '$xs',
  },
  a: {
    color: '$link !important',
    overflowWrap: 'anywhere',
  },
  'pre, code': {
    background: '$surfaceNested !important',
    whiteSpace: 'normal !important',
    '*': {
      overflowWrap: 'anywhere',
      fontFamily:
        "Consolas, 'Liberation Mono', Menlo, Courier, monospace !important",
    },
  },
  '.copied': {},
  '*:last-child:not(td, th)': {
    mb: '0 !important',
    pb: '0 !important',
  },
  pb: '$sm !important',
  'pre > code': {
    p: '$sm !important',
  },
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
    asPost: {
      true: {
        cursor: 'default',
        border: '1px dashed $border',
        p: '$sm',
      },
    },
    asNotification: {
      true: {
        cursor: 'default',
        borderColor: 'transparent',
        backgroundColor: '$surface !important',
        p: '$md !important',
        minHeight: 0,
      },
    },
    render: {
      true: {
        cursor: 'text',
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
  const navigate = useNavigate();

  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <StyledMarkdownPreview
          className="markdownPreview clickThrough"
          {...props}
          skipHtml={false}
          disableCopy
          components={{
            a: ({ ...props }) => {
              return (
                <a
                  {...props}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (props.href?.startsWith(webAppURL('colinks'))) {
                      navigate(props.href.replace(webAppURL('colinks'), ''));
                    } else if (props.href?.startsWith('/')) {
                      navigate(props.href);
                    } else {
                      window.open(props.href, '_blank');
                    }
                  }}
                >
                  {props.children}
                </a>
              );
            },
          }}
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
