import { User } from '../types';
import './UserList.css';

interface UserListProps {
  users: User[];
  votedUserIds?: Set<string>;
}

function UserList({ users, votedUserIds = new Set() }: UserListProps) {
  return (
    <div className="card user-list">
      <h2>👥 Participantes</h2>
      <div className="users">
        {users.length === 0 ? (
          <p className="no-users">Nenhum participante ainda</p>
        ) : (
          users.map((user) => {
            const hasVoted = votedUserIds.has(user.id);
            return (
              <div key={user.id} className={`user-item ${hasVoted ? 'voted' : ''}`}>
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                {hasVoted && <span className="vote-indicator">✓</span>}
              </div>
            );
          })
        )}
      </div>
      <div className="user-count">
        {users.length} {users.length === 1 ? 'participante' : 'participantes'}
      </div>
    </div>
  );
}

export default UserList;

