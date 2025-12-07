import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '../services/api';
import CreateRoomModal from '../components/CreateRoomModal';
import './Home.css';

interface UserRoom {
  roomId: string;
  roomName: string;
  lastAccessed: number;
}

function Home() {
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userRooms, setUserRooms] = useState<UserRoom[]>([]);
  const navigate = useNavigate();

  // Carregar userName do localStorage e salas do usuário
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setOwnerName(storedUserName);
    }

    // Carregar salas do usuário
    const storedRooms = localStorage.getItem('userRooms');
    if (storedRooms) {
      try {
        const rooms: UserRoom[] = JSON.parse(storedRooms);
        // Ordenar por último acesso (mais recente primeiro)
        rooms.sort((a, b) => b.lastAccessed - a.lastAccessed);
        setUserRooms(rooms);
      } catch {
        // Ignorar erro de parsing
      }
    }
  }, []);

  // Função para adicionar sala à lista do usuário
  const addUserRoom = (roomId: string, roomName: string) => {
    const storedRooms = localStorage.getItem('userRooms');
    let rooms: UserRoom[] = storedRooms ? JSON.parse(storedRooms) : [];
    
    // Remover se já existir
    rooms = rooms.filter(r => r.roomId !== roomId);
    
    // Adicionar no início
    rooms.unshift({
      roomId,
      roomName,
      lastAccessed: Date.now(),
    });

    // Manter apenas as últimas 20 salas
    if (rooms.length > 20) {
      rooms = rooms.slice(0, 20);
    }

    localStorage.setItem('userRooms', JSON.stringify(rooms));
    setUserRooms(rooms);
  };

  const handleCreateRoom = async (roomName: string) => {
    setError('');
    setLoading(true);

    try {
      if (!roomName.trim() || !ownerName.trim()) {
        setError('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      const response = await roomApi.createRoom({
        name: roomName.trim(),
        ownerName: ownerName.trim(),
      });

      // Salvar userId e userName globalmente e por sala
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userName', ownerName.trim());
      localStorage.setItem(`userId_${response.roomId}`, response.userId);
      localStorage.setItem(`userName_${response.roomId}`, ownerName.trim());

      // Adicionar sala à lista do usuário
      addUserRoom(response.roomId, response.roomName);

      setShowCreateModal(false);
      navigate(`/room/${response.roomId}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erro ao criar sala. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    // Atualizar último acesso
    const storedRooms = localStorage.getItem('userRooms');
    if (storedRooms) {
      try {
        const rooms: UserRoom[] = JSON.parse(storedRooms);
        const roomIndex = rooms.findIndex(r => r.roomId === roomId);
        if (roomIndex !== -1) {
          rooms[roomIndex].lastAccessed = Date.now();
          rooms.sort((a, b) => b.lastAccessed - a.lastAccessed);
          localStorage.setItem('userRooms', JSON.stringify(rooms));
          setUserRooms(rooms);
        }
      } catch {
        // Ignorar erro
      }
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎯 Planning Poker</h1>
        <p className="subtitle">Estime tarefas de forma colaborativa e eficiente</p>

        <div className="card">
          <h2>Bem-vindo{ownerName ? `, ${ownerName}` : ''}!</h2>
          
          <div className="form-group">
            <label htmlFor="ownerName">Seu Nome</label>
            <input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => {
                const newName = e.target.value;
                setOwnerName(newName);
                if (newName.trim()) {
                  localStorage.setItem('userName', newName.trim());
                }
              }}
              placeholder="Ex: João"
              required
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              if (!ownerName.trim()) {
                setError('Por favor, informe seu nome primeiro');
                return;
              }
              setShowCreateModal(true);
            }}
            disabled={loading || !ownerName.trim()}
          >
            + Criar Nova Sala
          </button>

          {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}
        </div>

        {userRooms.length > 0 && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2>Suas Salas</h2>
            <div className="rooms-list">
              {userRooms.map((room) => (
                <div key={room.roomId} className="room-item">
                  <div className="room-info">
                    <h3>{room.roomName}</h3>
                    <span className="room-id">ID: {room.roomId}</span>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleJoinRoom(room.roomId)}
                  >
                    Entrar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-card">
          <h3>Como funciona?</h3>
          <ul>
            <li>Crie uma sala e compartilhe o link com sua equipe</li>
            <li>Adicione atividades que precisam ser estimadas</li>
            <li>Inicie a votação e todos votam simultaneamente</li>
            <li>Revele os resultados e discuta as estimativas</li>
          </ul>
        </div>
      </div>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => {
            setShowCreateModal(false);
            setError('');
          }}
          onCreate={handleCreateRoom}
          userName={ownerName}
        />
      )}
    </div>
  );
}

export default Home;

