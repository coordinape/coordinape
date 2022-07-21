import { Button, Flex, Modal, Text } from 'ui';

export const RemoveCircleModal = ({
  onClose,
  visible,
}: {
  onClose: () => void;
  visible: boolean;
}) => {
  return (
    <Modal onClose={onClose} open={visible}>
      <Flex column css={{ gap: '$xl' }}>
        <Text h2 bold>
          Remove Circle?
        </Text>
        <Text size="medium">Are you sure to remove the circle</Text>
        <Flex css={{ gap: '$lg' }}>
          <Button size="large" color="primary" outlined>
            Cancel
          </Button>
          <Button size="large" color="destructive">
            Remove
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
