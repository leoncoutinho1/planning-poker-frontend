import { io, Socket } from 'socket.io-client';
import { RoomState, ResultsRevealedData, Activity } from '../types';
import { config } from '../config';

const SOCKET_URL = config.socketUrl;

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Eventos emitidos pelo cliente
  joinRoom(roomId: string, userId: string, userName: string) {
    this.socket?.emit('join-room', { roomId, userId, userName });
  }

  createActivity(roomId: string, userId: string, title: string, description: string) {
    this.socket?.emit('create-activity', { roomId, userId, title, description });
  }

  startVoting(roomId: string, userId: string, activityId: string) {
    this.socket?.emit('start-voting', { roomId, userId, activityId });
  }

  vote(roomId: string, userId: string, activityId: string, vote: number) {
    this.socket?.emit('vote', { roomId, userId, activityId, vote });
  }

  revealResults(roomId: string, userId: string, activityId: string) {
    this.socket?.emit('reveal-results', { roomId, userId, activityId });
  }

  removeActivity(roomId: string, userId: string, activityId: string) {
    this.socket?.emit('remove-activity', { roomId, userId, activityId });
  }

  // Event listeners
  onRoomState(callback: (data: RoomState) => void) {
    this.socket?.on('room-state', callback);
  }

  onUserJoined(callback: (data: { userId: string; userName: string }) => void) {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: { userId: string; userName: string }) => void) {
    this.socket?.on('user-left', callback);
  }

  onActivityCreated(callback: (data: { id: string; title: string; description: string; status: string }) => void) {
    this.socket?.on('activity-created', callback);
  }

  onVotingStarted(callback: (data: { activityId: string; activity: Activity }) => void) {
    this.socket?.on('voting-started', callback);
  }

  onVoteReceived(callback: (data: { activityId: string; userId: string; userName: string; hasVoted: boolean }) => void) {
    this.socket?.on('vote-received', callback);
  }

  onAllVoted(callback: (data: { activityId: string }) => void) {
    this.socket?.on('all-voted', callback);
  }

  onResultsRevealed(callback: (data: ResultsRevealedData) => void) {
    this.socket?.on('results-revealed', callback);
  }

  onActivityRemoved(callback: (data: { activityId: string }) => void) {
    this.socket?.on('activity-removed', callback);
  }

  onError(callback: (data: { message: string }) => void) {
    this.socket?.on('error', callback);
  }

  // Remover listeners
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();

