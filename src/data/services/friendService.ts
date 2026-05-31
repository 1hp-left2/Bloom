import { blockUserAction, friendInteractionAction, removeFriendAction, respondFriendRequestAction, sendFriendRequestAction } from '../../application/mosslightActions';
import { FriendGiftKind, MosslightState } from '../../domain/types';

export const friendService = {
  requests: (state: MosslightState) => state.friendRequests,
  friends: (state: MosslightState) => state.friends.filter((friend) => !friend.blocked),
  activity: (state: MosslightState) => state.friendActivities,
  request: (state: MosslightState, addresseeId: string) => sendFriendRequestAction(state, addresseeId),
  respond: (state: MosslightState, requestId: string, accept: boolean) => respondFriendRequestAction(state, requestId, accept),
  gift: (state: MosslightState, friendId: string, kind: FriendGiftKind, message: string) => friendInteractionAction(state, friendId, kind, message),
  visit: (state: MosslightState, friendId: string) => friendInteractionAction(state, friendId, 'visit', 'Visited a friend garden.'),
  remove: (state: MosslightState, friendId: string) => removeFriendAction(state, friendId),
  block: (state: MosslightState, friendId: string) => blockUserAction(state, friendId)
};
