import React, { useEffect, useState } from "react";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";
import { Wheel } from "react-custom-roulette";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { formattedAddress } from "~~/utils/formatAddress";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

interface RouletteProps {
  show?: boolean;
  setShow: (boolean) => void;
}
export default function Roulette({ show, setShow }: RouletteProps) {
  const [spin, setSpin] = useState(false);
  const [NPOWinner, setNPOWinner] = useState(0);
  const [donorWinner, setDonorWinner] = useState(0);
  const [donors, setDonors] = useState<any[]>([]);
  const [npos, setNPOs] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [doneSpin, setDoneSpin] = useState(0);

  const { data: qDonorWinner } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "lastUserWinner",
  });

  const { data: qNPOWinner } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "lastNPOWinner",
  });

  const { data: qDonors } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfDonors",
  });

  const { data: qNPOs } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfNPOs",
  });

  useEffect(() => {
    if (qDonors) {
      const newDonors = qDonors.map(donor => {
        return {
          ...donor,
          option: formattedAddress(donor.user),
        };
      });
      newDonors.sort((a, b) => Number(b.amount - a.amount));
      setDonors(newDonors);
    }
  }, [qDonors]);

  useEffect(() => {
    if (qNPOs) {
      const newNPOs = qNPOs.map(npo => {
        return {
          ori: npo.addr,
          option: npo.name,
        };
      });
      setNPOs(newNPOs);
    }
  }, [qNPOs]);

  useEffect(() => {
    if (qDonorWinner && donors.length) {
      const index = donors.findIndex(ele => ele.user === qDonorWinner);
      // if (index === -1) notification.error("Winner can't be found");
      setDonorWinner(index);
    }
  }, [qDonorWinner, donors]);

  useEffect(() => {
    if (qNPOWinner && npos.length) {
      const index = npos.findIndex(ele => ele.ori === qNPOWinner);

      setNPOWinner(index);
    }
  }, [qNPOWinner, npos]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSpin = () => {
    setSpin(true);
  };

  useEffect(() => {
    const timeout = setTimeout(handleSpin, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (typeof window === "undefined") return <></>;

  return (
    <Backdrop show={show} onClick={() => setShow(false)}>
      <motion.div
        onClick={e => e.stopPropagation()}
        className="mx-4"
        variants={dropIn}
        initial="hidden"
        // animate={show ? "visible" : "hidden"}
        animate={"visible"}
        exit="exit"
      >
        <div className="p-10 flex flex-col justify-center items-center bg-base-100 border-2 border-black rounded-3xl mb-20">
          <p className="text-xl font-bold mb-2">The Lucky Ones are...</p>
          {donors?.length && npos?.length && isClient ? (
            <>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">✨ Donor ✨</span>
                  <Wheel
                    mustStartSpinning={spin}
                    prizeNumber={donorWinner} // the winning address
                    data={donors}
                    backgroundColors={["#70d6ff", "#ff70a6", "#ff9770", "#ffd670"]}
                    textColors={["#ffffff"]}
                    outerBorderColor="#fff"
                    radiusLineColor="#fff"
                    // perpendicularText={true}
                    textDistance={60}
                    onStopSpinning={() => setDoneSpin(x => (x += 1))}
                  />
                </div>

                {doneSpin === 2 && <ConfettiExplosion zIndex={100} force={0.7} />}
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold"> 🎉 NPO 🎉</span>
                  <Wheel
                    mustStartSpinning={spin}
                    prizeNumber={NPOWinner} // the winning address
                    data={npos}
                    backgroundColors={["#70d6ff", "#ff70a6", "#ff9770", "#ffd670"]}
                    textColors={["#ffffff"]}
                    outerBorderColor="#fff"
                    radiusLineColor="#fff"
                    // perpendicularText={true}
                    textDistance={60}
                    onStopSpinning={() => setDoneSpin(x => (x += 1))}
                  />
                </div>
              </div>
              <button className="btn btn-secondary w-20 mt-4" onClick={() => setShow(false)}>
                Close
              </button>

              {/* <ButtonMarquee text="Spin" isLoading={spin} onClick={() => setSpin(true)} /> */}
            </>
          ) : (
            <p>Roulette is not ready now :c</p>
          )}
        </div>
      </motion.div>
    </Backdrop>
  );
}
