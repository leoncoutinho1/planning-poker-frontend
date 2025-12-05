import { useState, useEffect } from 'react';
import { Activity } from '../types';
import { socketService } from '../services/socket';
import './VotingArea.css';

const VOTING_CARDS = [1, 2, 3, 4, 5, 6, 7, 8];

interface VotingAreaProps {
  activity: Activity | null;
  roomId: string;
  userId: string;
  onVoteReceived?: (userId: string) => void;
}

function VotingArea({ activity, roomId, userId, onVoteReceived }: VotingAreaProps) {
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedUsers, setVotedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activity) return;

    const handleVoteReceived = (data: {
      activityId: string;
      userId: string;
      userName: string;
      hasVoted: boolean;
    }) => {
      if (data.activityId === activity.id) {
        setVotedUsers((prev) => new Set([...prev, data.userId]));
        if (onVoteReceived) {
          onVoteReceived(data.userId);
        }
      }
    };

    socketService.onVoteReceived(handleVoteReceived);

    return () => {
      socketService.off('vote-received', handleVoteReceived);
    };
  }, [activity, onVoteReceived]);

  // Reset quando a atividade muda
  useEffect(() => {
    if (activity && activity.status === 'voting') {
      setSelectedVote(null);
      setHasVoted(false);
      setVotedUsers(new Set());
    }
  }, [activity?.id]);

  const handleVote = (vote: number) => {
    if (!activity) return;

    // Se já votou e está selecionando o mesmo voto, não faz nada
    if (hasVoted && selectedVote === vote) {
      return;
    }

    setSelectedVote(vote);
    socketService.vote(roomId, userId, activity.id, vote);
    
    // Marca como votou (mesmo que seja mudança de voto)
    if (!hasVoted) {
      setHasVoted(true);
      setVotedUsers((prev) => new Set([...prev, userId]));
      if (onVoteReceived) {
        onVoteReceived(userId);
      }
    }
  };

  const isVoting = activity && activity.status === 'voting';

  return (
    <div className="voting-footer">
      <div className="voting-activity-info">
        {isVoting && (
          <>
            <h3>{activity.title}</h3>
            {hasVoted && (
              <span className="vote-confirmation-badge">
                ✅ Você votou! (Clique em outra carta para mudar)
              </span>
            )}
          </>
        )}
      </div>
      <div className="voting-cards">
        {VOTING_CARDS.map((card) => (
          <button
            key={card}
            className={`vote-card ${
              selectedVote === card ? 'selected' : ''
            } ${!isVoting ? 'hidden' : ''}`}
            onClick={() => handleVote(card)}
            disabled={!isVoting}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VotingArea;
