import { CSS } from '../../stitches.config';
import { Panel } from '../../ui';

export const GiveRowGrid = ({
  selected,
  gridView,
  children,
  css,
}: {
  selected: boolean;
  gridView: boolean;
  children: React.ReactNode;
  css?: CSS;
}) => {
  return (
    <Panel
      nested={!gridView}
      css={{
        flex: 'auto',
        p: gridView ? '$md' : '0 $sm !important',
        border: '1px solid $borderDim',
        cursor: 'pointer',
        backgroundColor: selected ? '$highlight' : '$surface',
        borderColor: selected ? '$link' : undefined,
        transition: 'border-color 0.3s',
        '&:hover': {
          backgroundColor: '$activePanel',
          borderColor: 'transparent',
          '.epochStatementWrapper::after': {
            background: 'linear-gradient(transparent, $activePanel)',
          },
        },
        '@sm': {
          p: '$md',
        },
        ...css,
      }}
    >
      {children}
    </Panel>
  );
};
