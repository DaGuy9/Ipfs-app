import React from 'react';

interface GameOverScreenProps {
  onPlayAgain: () => void;
  onHome: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onPlayAgain, onHome }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Game Over</h1>
        <button
          onClick={onPlayAgain}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600 transition duration-200"
        >
          Play Again
        </button>
        <button
          onClick={onHome}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;