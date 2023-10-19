import { MarkdownPreview } from '../../ui';

import { Activity } from './useInfiniteActivities';

export const DeletedRow = ({ activity }: { activity: Activity }) => {
  const propsMarkdown = `\`\`\`json
    ${JSON.stringify(activity, null, '\t')}`;
  if (!activity.actor_profile_public || !activity.actor_profile_public.name) {
    return <div>actor is null or has no name</div>;
  }
  return (
    <div>
      <div>deleted row</div>
      <div>
        <MarkdownPreview
          render
          source={propsMarkdown}
          css={{ cursor: 'auto' }}
        />
      </div>
    </div>
  );

  // <Flex alignItems="center">
  //   {activity.actor_profile_public && (
  //     <ActivityAvatar profile={activity.actor_profile_public} />
  //   )}
  //   <Flex column css={{ flexGrow: 1, ml: '$md' }}>
  //     <Flex css={{ gap: '$sm' }}>
  //       {activity.actor_profile_public && (
  //         <ActivityProfileName profile={activity.actor_profile_public} />
  //       )}
  //       <Text color="secondary" size="small">
  //         Deleted Actiivy
  //       </Text>
  //       <Text size="small" css={{ color: '$neutral' }}>
  //         {DateTime.fromISO(activity.created_at).toRelative()}
  //       </Text>
  //     </Flex>
  //
  //     <MarkdownPreview
  //       render
  //       source={propsMarkdown}
  //       css={{ cursor: 'auto' }}
  //     />
  //   </Flex>
  // </Flex>
};
