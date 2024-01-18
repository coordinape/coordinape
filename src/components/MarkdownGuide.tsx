import { Info } from 'icons/__generated';
import { Flex, Link, Text, Tooltip } from 'ui';

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
            <Flex column css={{ gap: '$sm' }}>
              {EXAMPLES.map(([label, example]) => (
                <Flex css={{ alignItems: 'center' }} key={label}>
                  <Text semibold size="small" css={{ minWidth: '3rem' }}>
                    {label}
                  </Text>
                  <CopyCodeTextField value={example} />
                </Flex>
              ))}

              <Link
                href={EXTERNAL_URL_MARKDOWN_DOCS}
                target="_blank"
                rel="noreferrer"
                css={{ display: 'block', mt: '$xs' }}
              >
                Full Markdown Documentation
              </Link>
            </Flex>
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
