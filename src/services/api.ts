import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = config.apiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateRoomRequest {
  name: string;
  ownerName: string;
}

export interface CreateRoomResponse {
  roomId: string;
  userId: string;
  roomName: string;
  shareLink: string;
}

export const roomApi = {
  createRoom: async (data: CreateRoomRequest): Promise<CreateRoomResponse> => {
    const response = await api.post<CreateRoomResponse>('/api/rooms', data);
    return response.data;
  },

  getRoom: async (roomId: string) => {
    const response = await api.get(`/api/rooms/${roomId}`);
    return response.data;
  },
};

