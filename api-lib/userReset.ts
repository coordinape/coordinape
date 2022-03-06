import * as mutations from './gql/mutations';
import * as queries from './gql/queries';

const userReset = async function (userId: number) {
  const { pending_sent_gifts, pending_received_gifts } =
    await queries.getPendingGifts(userId);

  for (const g of pending_sent_gifts) {
    // const recipientId = g.recipient_id;
    //   $rUser = $existingGift->recipient;
    await mutations.deleteGift(g.id);
    // TODO: update the pendingReceivedGifts memo on the user now that this was deleted, , probably in an event trigger
    //   $rUser->give_token_received = $rUser->pendingReceivedGifts()->get()->SUM('tokens');
    //   $rUser->save();
  }

  for (const g of pending_received_gifts) {
    await mutations.deleteGift(g.id);
    // TODO: update the senders give_token_remaining, probably in an event trigger
    //   $sender = $gift->sender;
    //   $gift_token = $gift->tokens;
    //   $token_used = $sender->pendingSentGifts->SUM('tokens') - $gift_token;
    //   $sender->give_token_remaining = $sender->starting_tokens - $token_used;
    //   $sender->save();
  }

  await mutations.deleteTeammate(9);
  //   $user->give_token_remaining = $user->starting_tokens;
  //   $user->give_token_received = 0;
  //   $user->save();
};

export default userReset;
