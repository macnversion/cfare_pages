import React from 'react';
import { type Team } from '../teams';

interface ScoreboardProps {
  scores: { A: number, B: number };
  currentPlayer: 'A' | 'B';
  teamA: Team | null;
  teamB: Team | null;
  remainingTime: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ scores, currentPlayer, teamA, teamB, remainingTime }) => {
  const teamAStyles = currentPlayer === 'A' ? 'border-yellow-400 scale-105' : 'border-transparent opacity-75';
  const teamBStyles = currentPlayer === 'B' ? 'border-yellow-400 scale-105' : 'border-transparent opacity-75';

  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center w-full max-w-md bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-700 mb-4">
      <div className={`flex-1 text-center p-2 rounded-l-md transition-all duration-300 border-b-4 ${teamAStyles}`} style={{ backgroundColor: teamA?.primaryColor || '#ef4444' }}>
        <span className="font-bold text-xl text-white drop-shadow-md uppercase">{teamA?.name || 'Team A'}</span>
        <span className="block font-black text-4xl text-white drop-shadow-lg">{scores.A}</span>
      </div>
      <div className="text-center text-white px-4">
        <div className="text-3xl font-mono tracking-widest">{formatTime(remainingTime)}</div>
      </div>
      <div className={`flex-1 text-center p-2 rounded-r-md transition-all duration-300 border-b-4 ${teamBStyles}`} style={{ backgroundColor: teamB?.primaryColor || '#3b82f6' }}>
        <span className="font-bold text-xl text-white drop-shadow-md uppercase">{teamB?.name || 'Team B'}</span>
        <span className="block font-black text-4xl text-white drop-shadow-lg">{scores.B}</span>
      </div>
    </div>
  );
};