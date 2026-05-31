import { FriendActivity, FriendGiftKind, FriendProfile, FriendRequest } from '../domain/types';
import { createId, nowISO } from '../utils/date';

export function createFriendRequest(requesterId: string, addresseeId: string): FriendRequest {
  if (requesterId === addresseeId) throw new Error('You cannot add yourself as a friend.');
  return { id: createId('friend_request'), requesterId, addresseeId, status: 'pending', createdAt: nowISO() };
}

export function respondToFriendRequest(request: FriendRequest, accept: boolean): FriendRequest {
  if (request.status !== 'pending') throw new Error('This friend request has already been handled.');
  return { ...request, status: accept ? 'accepted' : 'declined', respondedAt: nowISO() };
}

export function removeFriend(friends: FriendProfile[], friendId: string): FriendProfile[] {
  return friends.filter((friend) => friend.id !== friendId);
}

export function blockUser(friends: FriendProfile[], friendId: string): FriendProfile[] {
  return friends.map((friend) => friend.id === friendId ? { ...friend, blocked: true } : friend);
}

export function createFriendActivity(friendId: string, kind: FriendGiftKind | 'visit' | 'milestone', message: string): FriendActivity {
  return { id: createId('friend_activity'), friendId, kind, message, createdAt: nowISO() };
}
