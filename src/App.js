import React, { useState } from 'react';
import { teamNames } from './data/team-names';
import NameList from './components/name-list.component';
import TeamsList from './components/team-list.component';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [namesList, setNamesList] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [teams, setTeams] = useState([]);
  const [bulkUpload, setBulkUpload] = useState(false); 

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  
  const toggleBulkUpload = () => {
    setBulkUpload(!bulkUpload);
  };
  
  const addNameToList = () => {
    if (name.trim() !== '') {
      if (namesList.length >= 40) {
        console.log("Maximum number of players reached!");
        return;
      }
  
      let delimiter = ' ';
      if (name.includes('\n')) {
        delimiter = '\n';
      } else if (name.includes(',')) {
        delimiter = ',';
      } else if (name.includes(' ')) {
        delimiter = ' ';
      }
  
      const newPlayers = name.trim().split(delimiter).map((playerName, index) => ({
        id: namesList.length + index + 1,
        name: playerName.trim(),
        gamesPlayed: 0
      }));
  
      setNamesList([...namesList, ...newPlayers]);
      setName('');
      setShowWarning(namesList.length < 9);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNameToList();
    }
  };

 const markPlaying = (index) => {
  const updatedTeams = [...teams];
  const team = updatedTeams[index];
  if (team) {
    team.players.forEach(player => {
      player.gamesPlayed++;
    });
    setTeams(updatedTeams);
  }
};

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleLockTeam = (index) => {
    const updatedTeams = [...teams];
    const team = updatedTeams[index];
    if (team) {
      team.locked = true;
      setTeams(updatedTeams);
    }
  };

  const generateTeams = () => {
    if (namesList.length < 10) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
  
    if (!teams.some(team => team.locked)) {
      const newTeams = shuffleNewList(namesList, teamNames);
      setTeams(newTeams);
    } else {
      const lockedTeams = teams.filter(team => team.locked);
      const unassignedPlayers = [];
      const totalPlayersCount = teams.reduce((total, team) => total + team.players.length, 0);


    if (namesList.length !== totalPlayersCount) {
      // Add new players to the unassigned players list
      const newPlayers = namesList.slice(totalPlayersCount);
      unassignedPlayers.push(...newPlayers);
    }

    teams.forEach(team => {
      if (!team.locked) {
        unassignedPlayers.push(...team.players);
      }
    });

      while (unassignedPlayers.length > 0 && teams.some(team => team.locked && team.players.length < 5)) {

        
        const lastLockedTeamIndex = teams.findIndex(team => team.locked);
        const lastLockedTeam = teams[lastLockedTeamIndex];
        console.log(lastLockedTeam)
        if (lastLockedTeam && lastLockedTeam.players.length < 5) {
          const playerToAdd = unassignedPlayers.shift();
          lastLockedTeam.players.push(playerToAdd);
          console.log(`Adding ${playerToAdd} to team ${lastLockedTeam.name}`);
        }
      }
  
      const updatedTeams = [...lockedTeams];
      const newTeams = shuffleNewList(unassignedPlayers, teamNames);
      updatedTeams.push(...newTeams);
      setTeams(updatedTeams);
    }
  };
  
  const shuffleNewList = (names, teamNames) => {
    // Generate initial teams
    const newTeams = [];
    const maxTeamSize = 5;
  
    if (names.length === 0) {
      return newTeams;
    }
  
    if (names.length <= 5) {
      const teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
      const team = {
        name: teamName,
        players: names
      };
      newTeams.push(team);
    } else {
      const initialPlayers = names.slice(0, 10); // Select the first 10 players
      const remainingPlayers = names.slice(10); // Remaining players after the first 10
      const shuffledInitialPlayers = shuffleArray([...initialPlayers]);
      const shuffledRemainingPlayers = shuffleArray([...remainingPlayers]);
  
      const numTeams = Math.ceil(remainingPlayers.length / maxTeamSize) + 2; // Initial teams + subsequent teams
  
      for (let i = 0; i < 2; i++) {
        const teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
        const team = {
          name: teamName,
          players: shuffledInitialPlayers.slice(i * maxTeamSize, (i + 1) * maxTeamSize)
        };
        newTeams.push(team);
      }
  
      // Generate subsequent teams
      for (let i = 0; i < numTeams - 2; i++) {
        const teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
        const team = {
          name: teamName,
          players: shuffledRemainingPlayers.slice(i * maxTeamSize, (i + 1) * maxTeamSize)
        };
        newTeams.push(team);
      }
    }
    return newTeams;
  };

  const clearNames = () => {
    setNamesList([]);
    setTeams([]);
  };
 
  const deletePlayer = (teamIndex, playerIndex) => {
    const updatedTeams = [...teams];
    const deletedPlayer = updatedTeams[teamIndex].players.splice(playerIndex, 1);
    console.log('Deleted player: ' + deletedPlayer[0].name)
    
    setTeams(updatedTeams);
  };
  
  return (
    <div className="container">
      <h1>Lineup Generator</h1>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter player name"
      />
      <button onClick={addNameToList}>Add Player</button>
      <button onClick={generateTeams} className="generateButton">Generate Teams</button>
      <button onClick={clearNames} className="refreshButton">Refresh</button>
      <NameList names={namesList}/>
      {showWarning && (
        <div className="warning">Please enter at least 10 names.</div>
      )}
      <TeamsList teams={teams} lockTeam={handleLockTeam} onDeletePlayer={deletePlayer}  handleMarkPlaying={markPlaying}/>
    </div>
  );
}

export default App;