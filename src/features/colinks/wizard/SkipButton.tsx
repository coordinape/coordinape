import { ArrowRight } from '../../../icons/__generated';
import { Button, Link } from '../../../ui';

export function SkipButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      outlined
      color={'secondary'}
      as={Link}
      inlineLink
      onClick={onClick}
      css={{
        '&:hover': { textDecoration: 'none' },
        width: '100%',
        alignItems: 'center',
      }}
    >
      {children} <ArrowRight />
    </Button>
  );
}
