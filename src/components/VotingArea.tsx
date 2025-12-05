import { useState, useEffect } from 'react';
import { Activity } from '../types';
import { socketService } from '../services/socket';
import './VotingArea.css';

interface VotingAreaProps {
  activity: Activity;
  roomId: string;
  userId: string;
  isOwner: boolean;
}

const FIBONACCI_CARDS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?'];

function VotingArea({ activity, roomId, userId, isOwner }: VotingAreaProps) {
  const [selectedVote, setSelectedVote] = useState<number | string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedUsers, setVotedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleVoteReceived = (data: {
      activityId: string;
      userId: string;
      userName: string;
      hasVoted: boolean;
    }) => {
      if (data.activityId === activity.id) {
        setVotedUsers((prev) => new Set([...prev, data.userId]));
      }
    };

    socketService.onVoteReceived(handleVoteReceived);

    return () => {
      socketService.off('vote-received', handleVoteReceived);
    };
  }, [activity.id]);

  const handleVote = (vote: number | string) => {
    if (hasVoted) return;

    setSelectedVote(vote);
    
    if (typeof vote === 'number') {
      socketService.vote(roomId, userId, activity.id, vote);
      setHasVoted(true);
      setVotedUsers((prev) => new Set([...prev, userId]));
    }
  };

  return (
    <div className="voting-area card">
      <h2>🗳️ Votação em Andamento</h2>
      <div className="voting-activity">
        <h3>{activity.title}</h3>
        {activity.description && <p>{activity.description}</p>}
      </div>

      <div className="voting-cards">
        {FIBONACCI_CARDS.map((card) => (
          <button
            key={card}
            className={`vote-card ${
              selectedVote === card ? 'selected' : ''
            } ${hasVoted ? 'disabled' : ''}`}
            onClick={() => handleVote(card)}
            disabled={hasVoted}
          >
            {card}
          </button>
        ))}
      </div>

      {hasVoted && (
        <div className="vote-confirmation">
          <p>✅ Você votou! Aguardando outros participantes...</p>
        </div>
      )}

      <div className="voting-status">
        <p>
          {votedUsers.size} participante(s) já votaram
        </p>
      </div>
    </div>
  );
}

export default VotingArea;

