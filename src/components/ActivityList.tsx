import { Activity } from '../types';
import { socketService } from '../services/socket';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
  currentActivityId: string | null;
  isOwner: boolean;
  roomId: string;
  userId: string;
}

function ActivityList({
  activities,
  currentActivityId,
  isOwner,
  roomId,
  userId,
}: ActivityListProps) {
  const handleStartVoting = (activityId: string) => {
    socketService.startVoting(roomId, userId, activityId);
  };

  const handleRevealResults = (activityId: string) => {
    socketService.revealResults(roomId, userId, activityId);
  };

  const handleRemoveActivity = (activityId: string) => {
    if (confirm('Tem certeza que deseja remover esta atividade?')) {
      socketService.removeActivity(roomId, userId, activityId);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#666' }}>
          Nenhuma atividade ainda. {isOwner && 'Adicione uma atividade para começar!'}
        </p>
      </div>
    );
  }

  return (
    <div className="activity-list">
      <h2>Atividades</h2>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`activity-card ${
            activity.id === currentActivityId ? 'active' : ''
          } ${activity.status}`}
        >
          <div className="activity-header">
            <h3>{activity.title}</h3>
            <span className={`status-badge ${activity.status}`}>
              {activity.status === 'pending' && '⏳ Pendente'}
              {activity.status === 'voting' && '🗳️ Votando'}
              {activity.status === 'completed' && '✅ Concluída'}
            </span>
          </div>

          {activity.description && (
            <p className="activity-description">{activity.description}</p>
          )}

          {activity.status === 'completed' && activity.result !== null && (
            <div className="activity-result">
              <div className="result-header">
                <strong>Resultado: {activity.result}</strong>
              </div>
              {activity.votes && activity.votes.length > 0 && (
                <div className="votes-details">
                  <h4>Votos individuais:</h4>
                  <div className="votes-list">
                    {activity.votes.map((vote, index) => (
                      <div key={index} className="vote-item">
                        <span className="vote-user">{vote.userName}:</span>
                        <span className="vote-value">{vote.vote}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isOwner && (
            <div className="activity-actions">
              {activity.status === 'pending' && (
                <button
                  className="btn btn-success"
                  onClick={() => handleStartVoting(activity.id)}
                >
                  Iniciar Votação
                </button>
              )}

              {activity.status === 'voting' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleRevealResults(activity.id)}
                >
                  Revelar Resultados
                </button>
              )}

              {activity.status !== 'voting' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveActivity(activity.id)}
                >
                  Remover
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ActivityList;

