import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import Arrow from './icons/Arrow';
import { coin, trophy } from './images';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [animatedClicks, setAnimatedClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const pointsToAdd = 12;
  const timerIntervalRef = useRef<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const squareSize = 50;
  const squares = useRef<{ id: number; x: number; y: number }[]>([]);
  const spawnIntervalRef = useRef<number | null>(null);
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initialStars = [];
    for (let i = 0; i < 11; i++) {
      initialStars.push({ id: Date.now() + i, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
    }
    setStars(initialStars);
  }, []);

  useEffect(() => {
    const animateStars = () => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          x: star.x + 0.1,
        }))
      );

      setStars((prevStars) => {
        const newStars = prevStars.filter((star) => star.x < window.innerWidth);
        if (newStars.length < 11) {
          for (let i = 0; i < 11 - newStars.length; i++) {
            newStars.push({ id: Date.now() + i, x: -5, y: Math.random() * window.innerHeight });
          }
        }
        return newStars;
      });

      requestAnimationFrame(animateStars);
    };

    animateStars();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!gameOver) {
      detectTap(e.clientX, e.clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!gameOver) {
      const touch = e.touches[0];
      detectTap(touch.clientX, touch.clientY);
    }
  };

  const detectTap = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const clickedSquare = squares.current.find(
      (square) =>
        x >= square.x &&
        x <= square.x + squareSize &&
        y >= square.y &&
        y <= square.y + squareSize
    );

    if (clickedSquare) {
      setPoints((points) => points + pointsToAdd);
      const newClick = { id: Date.now(), x: clickedSquare.x, y: clickedSquare.y };
      setClicks([...clicks, newClick]);
      squares.current = squares.current.filter((square) => square.id !== clickedSquare.id);

      setAnimatedClicks([...animatedClicks, newClick]);
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const handleTryAgain = () => {
    setPoints(0);
    setClicks([]);
    setAnimatedClicks([]);
    setTimer(30);
    setGameOver(false);
    squares.current = [];
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    startSpawning();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setGameOver(true);
          if (spawnIntervalRef.current) {
            clearInterval(spawnIntervalRef.current);
          }
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const startSpawning = () => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    spawnIntervalRef.current = window.setInterval(() => {
      if (squares.current.length < 10) {
        spawnSquare();
      }
    }, 500);
  };

  const spawnSquare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let x, y, overlapping;
    const attempts = 50;

    for (let i = 0; i < attempts; i++) {
      x = Math.random() * (canvas.width - squareSize);
      y = -squareSize;
      overlapping = false;

      for (const square of squares.current) {
        const distX = Math.abs(x - square.x);
        const distY = Math.abs(y - square.y);

        if (distX < squareSize && distY < squareSize) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        squares.current.push({ id: Date.now(), x, y });
        break;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animateSquares = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.current.forEach((square) => {
        square.y += 4;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(square.x, square.y, squareSize, squareSize);
      });

      squares.current = squares.current.filter((square) => square.y < canvas.height);

      requestAnimationFrame(animateSquares);
    };

    startSpawning();
    animateSquares();

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setGameOver(true);
          if (spawnIntervalRef.current) {
            clearInterval(spawnIntervalRef.current);
          }
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    timerIntervalRef.current = countdown;

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    animatedClicks.forEach((click) => {
      const duration = 1000;

      const timer = setTimeout(() => {
        setAnimatedClicks((prevClicks) => prevClicks.filter((c) => c.id !== click.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [animatedClicks]);

  return (
    <div className="min-h-screen flex flex-col items-center text-white font-medium overflow-hidden relative">
      <div className="absolute inset-0 h-full bg-gradient-overlay z-10"></div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-20 min-h-screen flex flex-col items-center text-white">
        <div className="top-0 left-0 w-full px-4 pt-8 z-20 flex justify-between items-center text-white border-b border-transparent">
          <div className="flex items-center">
            <img src={coin} width={34} height={34} alt="coin" />
            <span className="ml-2 text-3xl md:text-5xl font-bold">{points.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <span className="text-3xl md:text-5xl font-bold mx-4">{`00:${timer.toString().padStart(2, '0')}`}</span>
          </div>
          <div className="flex items-center ml-4">
            <img src={trophy} width={24} height={24} alt="trophy" />
            <span className="ml-1 text-sm md:text-base">
              Gold <Arrow size={18} className="ml-0 mb-1 inline-block" />
            </span>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center w-full">
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              width={window.innerWidth}
              height={window.innerHeight}
              style={{ border: '1px solid transparent', width: '100%', height: '100%' }}
              onClick={handleClick}
              onTouchStart={handleTouchStart}
            ></canvas>
            {clicks.map((click) => (
              <div
                key={click.id}
                className="click-animation"
                style={{ left: click.x, top: click.y }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              ></div>
            ))}
            {stars.map((star) => (
              <svg key={star.id} className="star absolute w-2.5 h-2.5" style={{ top: star.y, left: star.x }} viewBox="0 0 5 5" fill="" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2.5" cy="2.5" r="2.5" fill="white" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={gameOver}
        onRequestClose={() => setGameOver(false)}
        contentLabel="Game Over Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-4xl font-bold mb-4">Game Over</h2>
          <p className="text-lg mb-6">Your final score: {points.toLocaleString()}</p>
          <button onClick={handleTryAgain} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Try Again
          </button>
          <button onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
