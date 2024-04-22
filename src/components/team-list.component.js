import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TeamsList = ({ teams, lockTeam, onDeletePlayer, handleMarkPlaying }) => {
  return (
    <div className="teams">
      {teams.map((team, index) => (
        <div className="team" key={index}>
          <h2>{team.name}</h2>
          <ul>
            {team.players.map((player, playerIndex) => (
              <li key={player.id} className="player-container">
                <span className="player-name">{player.name}</span>
                <FaTimes className="delete-icon" onClick={() => onDeletePlayer(index, playerIndex)} />
              </li>
            ))}
          </ul>
          <div>
            {!team.locked && <button onClick={() => lockTeam(index)} className="lockButton">Lock</button>}
            <button onClick={() => handleMarkPlaying(index)} className="playButton">
              Play Game
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsList;