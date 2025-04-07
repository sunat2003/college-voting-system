import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound404 = () => {
  return (
    <div>
      <DotLottieReact src="404NotFound.lottie"       speed={0.5} // Slower playback
 loop autoplay />
    </div>
  );
};

export default NotFound404;
