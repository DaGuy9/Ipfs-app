import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import Arrow from './icons/Arrow';
import { bear, coin, highVoltage, notcoin, rocket, trophy} from './images';

const Home = () => {
  const [points, setPoints] = useState(29857775);
  const [energy, setEnergy] = useState(6400);
  const pointsToAdd = 12;
  const energyToReduce = 12;
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const handleButtonHold = (e: React.MouseEvent<HTMLImageElement, MouseEvent> | React.TouchEvent<HTMLImageElement>) => {
    e.preventDefault(); // Prevent default action to avoid image download
    console.log('Hold started');
    if (energy - energyToReduce < 0) {
      console.log('Not enough energy');
      return;
    }

    setIsHolding(true);
    const interval = window.setInterval(() => {
      if (isHolding) {
        setPoints((prevPoints) => {
          console.log(`Updating points from ${prevPoints} to ${prevPoints + pointsToAdd}`);
          return prevPoints + pointsToAdd;
        });
        setEnergy((prevEnergy) => {
          const newEnergy = prevEnergy - energyToReduce < 0 ? 0 : prevEnergy - energyToReduce;
          console.log(`Updating energy from ${prevEnergy} to ${newEnergy}`);
          return newEnergy;
        });
      }
    }, 1000); // Add points every second

    holdIntervalRef.current = interval;
  };

  const handleButtonRelease = () => {
    console.log('Hold released');
    setIsHolding(false);
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + 1, 6500);
        console.log(`Restoring energy from ${prevEnergy} to ${newEnergy}`);
        return newEnergy;
      });
    }, 100); // Restore 10 energy points every second

    return () => {
      clearInterval(interval); // Clear interval on component unmount
      if (holdIntervalRef.current !== null) {
        window.clearInterval(holdIntervalRef.current);
      }
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} />
            <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
          </div>
          <div className="mt-8">
            <Link to="/app">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Play
              </button>
            </Link>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1">
                  <img src={bear} width={24} height={24} alt="High Voltage" />
                  <span>Frens</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <img src={coin} width={24} height={24} alt="High Voltage" />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <img src={rocket} width={24} height={24} alt="High Voltage" />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / 6500) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4">
            <img
              src={notcoin}
              width={256}
              height={256}
              alt="notcoin"
              onMouseDown={handleButtonHold}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
              onTouchStart={handleButtonHold}
              onTouchEnd={handleButtonRelease}
              onContextMenu={(e) => e.preventDefault()} // Prevent right-click download
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
