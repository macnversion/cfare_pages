import React, { useState, useMemo } from 'react';
import { type Team, TEAMS } from '../teams';

interface TeamSelectionModalProps {
  onStartGame: (teamA: Team, teamB: Team) => void;
}

const groupTeams = (teams: Team[]) => {
    const grouped: { [key: string]: Team[] } = {
        'Countries': teams.filter(t => t.type === 'country'),
    };
    const leagueOrder = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Cosmic League'];
    
    leagueOrder.forEach(league => {
      const teamsInLeague = teams.filter(team => team.type === 'club' && team.league === league);
      if (teamsInLeague.length > 0) {
        grouped[league] = teamsInLeague;
      }
    });
    
    return grouped;
};


export const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({ onStartGame }) => {
  const [teamAId, setTeamAId] = useState<string>('');
  const [teamBId, setTeamBId] = useState<string>('');
  
  const groupedTeams = useMemo(() => groupTeams(TEAMS), []);

  const handleStart = () => {
    const teamA = TEAMS.find(t => t.id === teamAId);
    const teamB = TEAMS.find(t => t.id === teamBId);
    if (teamA && teamB) {
      onStartGame(teamA, teamB);
    }
  };

  const renderOptions = (disabledId: string) => {
    // Fix: Replaced Object.entries with Object.keys to improve type inference and resolve the "Property 'map' does not exist on type 'unknown'" error.
    return Object.keys(groupedTeams).map((groupName) => (
      <optgroup label={groupName} key={groupName}>
        {groupedTeams[groupName].map(team => (
          <option key={team.id} value={team.id} disabled={team.id === disabledId}>
            {team.name}
          </option>
        ))}
      </optgroup>
    ));
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-600 w-full max-w-2xl text-center animate-fade-in">
        <h2 className="text-4xl font-bold mb-6 text-white">Choose Your Teams</h2>
        
        <div className="flex justify-around items-start space-x-6 mb-8">
            {/* Team A Selection */}
            <div className="flex-1">
                <label htmlFor="teamA" className="block text-2xl font-semibold mb-3 text-red-400">Team 1</label>
                <select 
                    id="teamA" 
                    value={teamAId} 
                    onChange={(e) => setTeamAId(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="" disabled>Select a team...</option>
                    {renderOptions(teamBId)}
                </select>
            </div>

            {/* Team B Selection */}
             <div className="flex-1">
                <label htmlFor="teamB" className="block text-2xl font-semibold mb-3 text-blue-400">Team 2</label>
                <select 
                    id="teamB" 
                    value={teamBId} 
                    onChange={(e) => setTeamBId(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>Select a team...</option>
                    {renderOptions(teamAId)}
                </select>
            </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!teamAId || !teamBId}
          className="px-10 py-4 text-xl font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
        >
          Start Game
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};