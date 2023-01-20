import { DiscordEpochEvent } from '../sendSocialMessage';

export function isDiscordEpochEvent(
  event?: DiscordEpochEvent | boolean
): event is DiscordEpochEvent {
  return (event as DiscordEpochEvent).channelId !== undefined;
}
