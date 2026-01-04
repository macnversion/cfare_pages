import React from 'react';

interface ControlsProps {
  power: number;
  setPower: (power: number) => void;
  onShoot: () => void;
  onReset: () => void;
  disabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ power, setPower, onShoot, onReset, disabled }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 space-y-4 w-full">
      <div className="w-full flex items-center space-x-4">
        <label htmlFor="power" className="font-semibold text-lg">Power</label>
        <input
          id="power"
          type="range"
          min="1"
          max="15"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-green-500 disabled:opacity-50"
        />
        <span className="font-bold text-xl w-8 text-center">{power}</span>
      </div>
      <div className="w-full flex justify-center space-x-4">
        <button
          onClick={onShoot}
          disabled={disabled}
          className="px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed flex-grow"
        >
          SHOOT
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 text-lg font-bold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 flex-grow"
        >
          RESET
        </button>
      </div>
    </div>
  );
};