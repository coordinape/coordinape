import { Info } from 'icons/__generated';
import { Flex, Link, Table, Text, Tooltip } from 'ui';

import CopyCodeTextField from './CopyCodeTextField';

export const EXTERNAL_URL_MARKDOWN_DOCS = 'https://github.github.com/gfm/';

const EXAMPLES = [
  ['Bold', ' **bold text** '],
  ['Italic', ' *italicized text* '],
  ['Code', ' `code` '],
  ['Link', ' [link text](/uri) '],
  ['Image', ' ![alt text](http://image.jpg) '],
];

export const MarkdownGuide = () => {
  return (
    <Text
      inline
      size="small"
      color="secondary"
      css={{
        position: 'absolute',
        userSelect: 'none',
        right: '$sm',
        bottom: '$sm',
        zIndex: 12,
      }}
    >
      <Flex
        css={{
          alignItems: 'center',
          gap: '$xs',
        }}
      >
        <Tooltip
          content={
            <>
              <Table
                css={{
                  td: {
                    paddingLeft: '0 !important',
                    paddingRight: '0 !important',
                  },
                  tr: {
                    borderTop: 'none !important',
                    borderBottom: 'none !important',
                  },
                }}
              >
                <tbody>
                  {EXAMPLES.map(([label, example]) => (
                    <tr key={label}>
                      <td>
                        <Text semibold size="small" css={{ pr: '$xs' }}>
                          {label}
                        </Text>
                      </td>
                      <td>
                        <CopyCodeTextField value={example} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Link
                href={EXTERNAL_URL_MARKDOWN_DOCS}
                target="_blank"
                rel="noreferrer"
                css={{ display: 'block', mt: '$sm' }}
              >
                Full Markdown Documentation
              </Link>
            </>
          }
        >
          <Flex css={{ alignItems: 'center', gap: '$xs' }}>
            <Text color="neutral">Markdown Supported</Text>
            <Info size="md" color="neutral" />
          </Flex>
        </Tooltip>
      </Flex>
    </Text>
  );
};
