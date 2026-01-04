
import React from 'react';

interface WinnerModalProps {
  winner: string;
  onReset: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onReset }) => {
  const isDraw = winner.toLowerCase().includes('draw');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-600 text-center animate-fade-in">
        <h2 className="text-4xl font-bold mb-4 text-yellow-400">{isDraw ? 'Full Time' : 'Game Over'}</h2>
        <p className="text-2xl mb-8">{winner}</p>
        <button
          onClick={onReset}
          className="px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-transform duration-200 hover:scale-105"
        >
          Play Again
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