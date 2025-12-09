import axios from 'axios';
import { config } from '../config';

// Se VITE_API_URL estiver vazia ou não definida, usa URL relativa (proxy do nginx)
// Isso permite acesso externo sem precisar configurar localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

