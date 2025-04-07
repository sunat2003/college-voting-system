import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoginAnimations = () => {
  return (
    <DotLottieReact
      src="login.lottie"
      loop
      autoplay
      speed={0.5} // Slower playback
      style={{ width: "60%", height: "60%" }} // Smaller size
    />
  );
};

export default LoginAnimations;

