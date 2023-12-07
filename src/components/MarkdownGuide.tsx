import { Info } from 'icons/__generated';
import { Flex, Link, Text, Tooltip } from 'ui';

import CopyCodeTextField from './CopyCodeTextField';

export const EXTERNAL_URL_MARKDOWN_DOCS = 'https://github.github.com/gfm/';

const EXAMPLES = [
  ['Bold', ' **bold text** '],
  ['Italic', ' *italicized text* '],
  ['Code', ' `code` '],
  ['Image', ' ![alt text](image.jpg) '],
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
      }}
    >
      <Flex css={{ alignItems: 'center' }}>
        Markdown Supported
        <Tooltip
          css={{ ml: '$sm' }}
          content={
            <>
              {EXAMPLES.map(([label, example]) => (
                <Flex css={{ alignItems: 'center' }} key={label}>
                  <Text semibold size="small">
                    {label}:{' '}
                  </Text>
                  <CopyCodeTextField value={example} />
                </Flex>
              ))}

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
          <Info size="md" />
        </Tooltip>
      </Flex>
    </Text>
  );
};
