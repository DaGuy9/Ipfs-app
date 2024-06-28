// GameOverScreen.d.ts
import React from 'react';

interface GameOverScreenProps {
  points: number;
  onTryAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps>;

export default GameOverScreen;
