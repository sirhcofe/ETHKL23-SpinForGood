import React, { useState } from "react";
import dynamic from "next/dynamic";
import ButtonMarquee from "./ButtonMarquee";
import Roulette from "./Roulette";
import { AnimatePresence } from "framer-motion";
import Countdown from "react-countdown";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const DynamicWheel = dynamic(import("~~/components/Roulette"), {
  ssr: false,
});

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <></>;
  } else {
    // Render a countdown
    return (
      <div className="flex gap-2 h-32 md:gap-8 md:h-40 w-full max-w-[800px]">
        <div className="bg-base-100 w-20 md:w-32 rounded-xl border-2 border-black font-bold text-3xl md:text-[60px] flex flex-col gap-5 justify-center items-center ">
          {days}
          <span className="text-base">D</span>
        </div>
        <div className="bg-base-100 w-20 md:w-32 rounded-xl border-2 border-black font-bold text-3xl md:text-[60px] flex flex-col gap-5 justify-center items-center ">
          {hours}
          <span className="text-base">H</span>
        </div>
        <div className="bg-base-100 w-20 md:w-32 rounded-xl border-2 border-black font-bold text-3xl md:text-[60px] flex flex-col gap-5 justify-center items-center ">
          {minutes}
          <span className="text-base">M</span>
        </div>
        <div className="bg-base-100 w-20 md:w-32 rounded-xl border-2 border-black font-bold text-3xl md:text-[60px] flex flex-col gap-5 justify-center items-center ">
          {seconds}
          <span className="text-base">S</span>
        </div>
      </div>
    );
  }
};

export default function CustomCountdown() {
  const [date, setDate] = useState<Date | number>(new Date(1697353200000));
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "SFGContract",
    functionName: "endOfDuration",
  });

  return (
    <div className="my-10 mb-14 max-w-max flex flex-col justify-center items-center">
      <p className="text-3xl font-bold mb-6">To the next Roullete⏳</p>
      <Countdown
        key={key}
        date={date}
        renderer={renderer}
        onComplete={() => {
          setShow(true);
          setDate(new Date(1697353200000));
          setKey(x => (x += 1));
        }}
      />
      <ButtonMarquee
        onClick={() => {
          writeAsync();
          setDate(Date.now() + 3000);
        }}
        text="Now"
      />
      <AnimatePresence>{show && <DynamicWheel setShow={setShow} />}</AnimatePresence>
    </div>
  );
}
