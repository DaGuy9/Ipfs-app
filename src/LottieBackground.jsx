import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import lottieData from './Animation - 1719011738271.json'; // Update the path to your Lottie JSON file

const LottieBackground = () => {
  const lottieContainerRef = useRef(null);

  useEffect(() => {
    if (lottieContainerRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottieData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
          clearCanvas: true, // Reduces rendering workload
          progressiveLoad: true, // Renders progressively to reduce initial load
          hideOnTransparent: true, // Hides elements with zero opacity to optimize performance
        },
      });

      return () => animation.destroy();
    }
  }, []);

  return (
    <div
      ref={lottieContainerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    />
  );
};

export default LottieBackground;
