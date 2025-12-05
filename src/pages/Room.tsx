import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '../services/socket';
import { roomApi } from '../services/api';
import { Room, Activity, User } from '../types';
import ActivityList from '../components/ActivityList';
import VotingArea from '../components/VotingArea';
import UserList from '../components/UserList';
import CreateActivityModal from '../components/CreateActivityModal';
import './Room.css';

function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [socketError, setSocketError] = useState('');
  const [votedUserIds, setVotedUserIds] = useState<Set<string>>(new Set());

  // Carregar userId e userName
  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    const storedUserId = localStorage.getItem(`userId_${roomId}`);
    const storedUserName = localStorage.getItem(`userName_${roomId}`);

    if (!storedUserId || !storedUserName) {
      const name = prompt('Digite seu nome para entrar na sala:');
      if (!name) {
        navigate('/');
        return;
      }
      const newUserId = crypto.randomUUID();
      localStorage.setItem(`userId_${roomId}`, newUserId);
      localStorage.setItem(`userName_${roomId}`, name);
      setUserId(newUserId);
      setUserName(name);
    } else {
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, [roomId, navigate]);

  // Carregar dados iniciais da sala
  useEffect(() => {
    if (!roomId) return;

    const loadRoom = async () => {
      try {
        const roomData = await roomApi.getRoom(roomId);
        setRoom(roomData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Sala não encontrada');
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  // Configurar socket e listeners
  useEffect(() => {
    if (!roomId || !userId || !userName) return;

    const socket = socketService.connect();

    // Configurar listeners
    const handleRoomState = (data: any) => {
      setRoom({
        id: data.room.id,
        name: data.room.name,
        ownerId: data.room.ownerId,
        users: data.users,
        activities: data.activities,
        currentActivityId: data.currentActivityId,
      });
    };

    const handleUserJoined = (data: { userId: string; userName: string }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        if (prevRoom.users.some((u) => u.id === data.userId)) return prevRoom;
        return {
          ...prevRoom,
          users: [...prevRoom.users, { id: data.userId, name: data.userName }],
        };
      });
    };

    const handleUserLeft = (data: { userId: string; userName: string }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          users: prevRoom.users.filter((u) => u.id !== data.userId),
        };
      });
    };

    const handleActivityCreated = (data: {
      id: string;
      title: string;
      description: string;
      status: string;
    }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          activities: [
            ...prevRoom.activities,
            {
              id: data.id,
              title: data.title,
              description: data.description,
              status: data.status as 'pending' | 'voting' | 'completed',
              result: null,
            },
          ],
        };
      });
    };

    const handleVotingStarted = (data: { activityId: string; activity: any }) => {
      setVotedUserIds(new Set()); // Reset votos quando nova votação inicia
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          activities: prevRoom.activities.map((a) =>
            a.id === data.activityId
              ? { ...a, status: 'voting' as const }
              : a
          ),
          currentActivityId: data.activityId,
        };
      });
    };

    // Rastrear votos recebidos
    const handleVoteReceived = (data: {
      activityId: string;
      userId: string;
      userName: string;
      hasVoted: boolean;
    }) => {
      setRoom((prevRoom) => {
        if (prevRoom && prevRoom.currentActivityId === data.activityId) {
          setVotedUserIds((prev) => new Set([...prev, data.userId]));
        }
        return prevRoom;
      });
    };

    const handleResultsRevealed = (data: {
      activityId: string;
      result: number;
      votes: any[];
    }) => {
      setVotedUserIds(new Set()); // Reset votos quando resultados são revelados
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          activities: prevRoom.activities.map((a) =>
            a.id === data.activityId
              ? { ...a, status: 'completed' as const, result: data.result, votes: data.votes }
              : a
          ),
          currentActivityId: null,
        };
      });
    };

    const handleActivityRemoved = (data: { activityId: string }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          activities: prevRoom.activities.filter((a) => a.id !== data.activityId),
          currentActivityId:
            prevRoom.currentActivityId === data.activityId
              ? null
              : prevRoom.currentActivityId,
        };
      });
    };

    const handleError = (data: { message: string }) => {
      setSocketError(data.message);
      setTimeout(() => setSocketError(''), 5000);
    };

    socketService.onRoomState(handleRoomState);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);
    socketService.onActivityCreated(handleActivityCreated);
    socketService.onVotingStarted(handleVotingStarted);
    socketService.onResultsRevealed(handleResultsRevealed);
    socketService.onActivityRemoved(handleActivityRemoved);
    socketService.onError(handleError);
    socketService.onVoteReceived(handleVoteReceived);

    // Entrar na sala quando socket estiver pronto
    const handleConnect = () => {
      socketService.joinRoom(roomId, userId, userName);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on('connect', handleConnect);
    }

    // Cleanup
    return () => {
      socketService.off('room-state', handleRoomState);
      socketService.off('user-joined', handleUserJoined);
      socketService.off('user-left', handleUserLeft);
      socketService.off('activity-created', handleActivityCreated);
      socketService.off('voting-started', handleVotingStarted);
      socketService.off('results-revealed', handleResultsRevealed);
      socketService.off('activity-removed', handleActivityRemoved);
      socketService.off('error', handleError);
      socketService.off('vote-received', handleVoteReceived);
      socket.off('connect', handleConnect);
      socketService.disconnect();
    };
  }, [roomId, userId, userName]);

  const isOwner = room && userId === room.ownerId;
  const currentActivity = room?.activities.find(
    (a) => a.id === room.currentActivityId
  );

  if (loading) {
    return <div className="loading">Carregando sala...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-message">{error}</div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (!room || !userId || !userName) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="room-container">
      <div className="room-header">
        <div className="room-title">
          <h1>{room.name}</h1>
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copiado para a área de transferência!');
            }}
          >
            📋 Copiar Link
          </button>
        </div>
        {socketError && <div className="error-message">{socketError}</div>}
      </div>

      <div className="room-content">
        <div className="room-main">
          <UserList users={room.users} votedUserIds={votedUserIds} />
        </div>

        <div className="room-sidebar">
          <ActivityList
            activities={room.activities}
            currentActivityId={room.currentActivityId}
            isOwner={isOwner || false}
            roomId={roomId!}
            userId={userId}
          />

          {isOwner && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              + Adicionar Atividade
            </button>
          )}
        </div>
      </div>

      <VotingArea
        activity={currentActivity || null}
        roomId={roomId!}
        userId={userId}
        isOwner={isOwner || false}
        onVoteReceived={(userId) => {
          setVotedUserIds((prev) => new Set([...prev, userId]));
        }}
      />

      {showCreateModal && (
        <CreateActivityModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(title, description) => {
            socketService.createActivity(roomId!, userId, title, description);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

export default RoomPage;

