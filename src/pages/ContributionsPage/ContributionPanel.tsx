import { Panel } from '../../ui';

export const ContributionPanel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Panel css={{ gap: '$md', borderRadius: '$4', mt: '$lg' }}>
      {children}
    </Panel>
  );
};
