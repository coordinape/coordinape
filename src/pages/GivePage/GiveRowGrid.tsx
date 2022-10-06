import { CSS } from '../../stitches.config';
import { Flex, Panel } from '../../ui';

export const GiveRowGrid = ({
  selected,
  children,
  css,
}: {
  selected: boolean;
  children: React.ReactNode;
  css?: CSS;
}) => {
  return (
    <Panel
      nested
      css={{
        padding: 0,
        pr: '$md',
        border: '2px solid transparent',
        cursor: 'pointer',
        backgroundColor: selected ? '$highlight' : undefined,
        borderColor: selected ? '$link' : undefined,
        transition: 'background-color 0.3s, border-color 0.3s',
        '&:hover': {
          backgroundColor: '$highlight',
          borderColor: '$link',
        },
        '@sm': {
          pb: '$sm',
        },
        ...css,
      }}
    >
      <Flex
        alignItems="center"
        css={{
          display: 'grid',
          gridTemplateColumns: '2fr 4fr 4fr',
          justifyContent: 'space-between',
          gap: '$lg',
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        {children}
      </Flex>
    </Panel>
  );
};
