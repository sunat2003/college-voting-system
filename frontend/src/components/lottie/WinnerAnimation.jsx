import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WinnerAnimation = () => {
  return (
    <DotLottieReact
      src="winner.lottie"
      autoplay
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '100%'
      }}
    />
  );
};

export default WinnerAnimation;
