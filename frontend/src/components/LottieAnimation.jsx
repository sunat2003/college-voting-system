import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottieAnimation = () => {
  return (
    <DotLottieReact
      src="Animation.lottie"
      autoplay
      style={{height:"70px",width:"140px"}}
    />
  );
};

export default LottieAnimation;