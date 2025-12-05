import { useState } from 'react';
import './CreateActivityModal.css';

interface CreateActivityModalProps {
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

function CreateActivityModal({ onClose, onCreate }: CreateActivityModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Atividade</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="activity-title">Título *</label>
            <input
              id="activity-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Implementar login"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity-description">Descrição</label>
            <textarea
              id="activity-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a atividade (opcional)"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateActivityModal;

