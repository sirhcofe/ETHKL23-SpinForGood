import React, { useEffect, useState } from "react";
import ButtonMarquee from "./ButtonMarquee";
import { Wheel } from "react-custom-roulette";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface RoulleteProps {
  donors: any[];
  npos: any[];
}

export default function Roullete({ donors, npos }: RoulleteProps) {
  const [spin, setSpin] = useState(false);
  const [NPOWinner, setNPOWinner] = useState(0);
  const [donorWinner, setDonorWinner] = useState(0);

  const { data: qDonorWinner } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "lastUserWinner",
  });

  const { data: qNPOWinner } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "lastNPOWinner",
  });

  useEffect(() => {
    if (qDonorWinner) {
      const index = donors.findIndex(ele => ele.user === qDonorWinner);
      console.log("donor win", index);

      setDonorWinner(index - 1);
    }
  }, [qDonorWinner]);

  useEffect(() => {
    if (qNPOWinner) {
      const index = npos.findIndex(ele => ele.ori === qNPOWinner);
      console.log("NPO win", index);
      console.log(qNPOWinner);
      console.log(npos);

      setNPOWinner(index - 1);
    }
  }, [qNPOWinner]);

  console.log(donorWinner, NPOWinner);
  return (
    <div className="py-10 flex flex-col justify-center items-center">
      {donors?.length && npos?.length ? (
        <>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center">
              <span>The Lucky Donor</span>
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
              />
            </div>
            <div className="flex flex-col items-center">
              <span>The Lucky NPO</span>
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
                onStopSpinning={() => setSpin(false)}
              />
            </div>
          </div>

          <ButtonMarquee text="Spin" isLoading={spin} onClick={() => setSpin(true)} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
