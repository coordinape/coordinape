import { CSS } from '../../../stitches.config';
import { Button, Flex, Panel, Text } from '../../../ui';

export const LearnCard = ({
  small = true,
  title,
  message,
  buttonTitle,
  backgroundImage,
  image,
  onClick,
  css,
}: {
  small?: boolean;
  title?: string;
  message?: string;
  buttonTitle?: string;
  backgroundImage?: string;
  image?: string;
  onClick?: () => void;
  css?: CSS;
}) => {
  const panelStyles = {
    border: 'none',
    flexDirection: small ? 'column' : 'row',
    p: small ? '0' : '0 $md 0 0',
    overflow: 'clip',
    alignItems: 'center',
    gap: small ? '0' : '$lg',
    cursor: 'pointer',
  };
  const artStyles = {
    flexGrow: 1,
    height: '100%',
    width: small ? '100%' : 'auto',
    minHeight: '180px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };
  const copyContainerStyles = {
    flex: 2,
    width: '100%',
    gap: small ? '$sm' : '$md',
    alignItems: 'flex-start',
    p: small ? '$md $sm $md' : '0',
  };

  const bg = backgroundImage
    ? { background: `url('${backgroundImage}')`, backgroundSize: 'cover' }
    : {};
  return (
    <Panel css={{ ...bg, ...panelStyles, ...css }} onClick={onClick}>
      {image && (
        <Flex
          className="art"
          css={{
            ...artStyles,
            backgroundImage: `url('${image}')`,
            backgroundPosition: 'bottom',
          }}
        />
      )}
      {title && (
        <Flex column css={{ ...copyContainerStyles, color: '$text' }}>
          <Text size={small ? 'medium' : 'large'} semibold>
            {title}
          </Text>
          <Text size={small ? 'small' : 'medium'}>{message}</Text>
          <Button as="span" color="secondary" size={small ? 'xs' : 'small'}>
            {buttonTitle}
          </Button>
        </Flex>
      )}
    </Panel>
  );
};
