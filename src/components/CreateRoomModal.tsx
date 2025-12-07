import { useState } from 'react';
import './CreateActivityModal.css';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreate: (roomName: string) => void;
  userName: string;
}

function CreateRoomModal({ onClose, onCreate, userName }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onCreate(roomName.trim());
      setRoomName('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Criar Nova Sala</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="room-name">Nome da Sala *</label>
            <input
              id="room-name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Ex: Sprint 1"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Seu Nome</label>
            <input
              type="text"
              value={userName}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar Sala
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;

