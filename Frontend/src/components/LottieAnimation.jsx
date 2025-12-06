import Lottie from "lottie-react";

export const LottieAnimation = ({ animationData, className }) => {
  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};
