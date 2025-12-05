import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '../services/api';
import './Home.css';

function Home() {
  const [roomName, setRoomName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Salvar userId no localStorage
      localStorage.setItem(`userId_${response.roomId}`, response.userId);
      localStorage.setItem(`userName_${response.roomId}`, ownerName.trim());

      navigate(`/room/${response.roomId}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erro ao criar sala. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎯 Planning Poker</h1>
        <p className="subtitle">Estime tarefas de forma colaborativa e eficiente</p>

        <div className="card">
          <h2>Criar Nova Sala</h2>
          <form onSubmit={handleCreateRoom}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="roomName">Nome da Sala</label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Ex: Sprint 1"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerName">Seu Nome</label>
              <input
                id="ownerName"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Ex: João"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Sala'}
            </button>
          </form>
        </div>

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
    </div>
  );
}

export default Home;

