import { CSS } from '../../../stitches.config';
import { Panel } from '../../../ui';

export const contentStyles = {
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
};
export const LearnCard = ({
  image,
  onClick,
  children,
  css,
}: {
  image: string;
  children?: React.ReactNode;
  onClick?: () => void;
  css?: CSS;
}) => {
  const artStyles = {
    border: 'none',
    flexDirection: 'column',
    p: 0,
    overflow: 'clip',
    gap: 0,
    cursor: 'pointer',
    width: '100%',
    minHeight: '180px',
    minWidth: '300px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    color: 'white',
    '@sm': {
      minHeight: '150px',
      minWidth: '250px',
    },
  };

  return (
    <Panel
      onClick={onClick}
      css={{
        ...artStyles,
        backgroundImage: `url('${image}')`,
        backgroundPosition: 'bottom',
        ...css,
      }}
    >
      {children}
    </Panel>
  );
};
