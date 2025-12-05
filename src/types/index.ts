export interface User {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'voting' | 'completed';
  result: number | null;
  votes?: VoteResult[];
}

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  users: User[];
  activities: Activity[];
  currentActivityId: string | null;
}

export interface CreateRoomResponse {
  roomId: string;
  userId: string;
  roomName: string;
  shareLink: string;
}

export interface VoteResult {
  userId: string;
  userName: string;
  vote: number;
}

export interface ResultsRevealedData {
  activityId: string;
  result: number;
  votes: VoteResult[];
}

export interface RoomState {
  room: {
    id: string;
    name: string;
    ownerId: string;
  };
  users: User[];
  activities: Activity[];
  currentActivityId: string | null;
}

