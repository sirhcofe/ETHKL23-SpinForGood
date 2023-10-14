import React from "react";
import Countdown from "react-countdown";

const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <div className="flex gap-8 h-40 w-full max-w-[800px]">
        <div className="bg-base-100 w-full max-w-[160px] rounded-xl border-2 border-black font-bold text-[60px] flex flex-col justify-center items-center ">
          {hours}
          <span className="text-base">HOURS</span>
        </div>
        <div className="bg-base-100 w-full max-w-[160px] rounded-xl border-2 border-black font-bold text-[60px] flex flex-col justify-center items-center ">
          {minutes}
          <span className="text-base">MINUTES</span>
        </div>
        <div className="bg-base-100 w-full max-w-[160px] rounded-xl border-2 border-black font-bold text-[60px] flex flex-col justify-center items-center ">
          {seconds}
          <span className="text-base">SECONDS</span>
        </div>
      </div>
    );
  }
};

export default function CustomCountdown() {
  console.log(Date.now());
  return (
    <div className="p-10 rounded-lg border-2 border-black bg-base-100 max-w-max">
      <p className="text-3xl font-bold">To the next Roullete⏳</p>
      <Countdown date={new Date(1697353200000)} renderer={renderer} />;
    </div>
  );
}
