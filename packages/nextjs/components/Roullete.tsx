import React, { useState } from "react";
import ButtonMarquee from "./ButtonMarquee";
import { Wheel } from "react-custom-roulette";

interface RoulleteProps {
  donors: any[];
  npos: any[];
}

export default function Roullete({ donors, npos }: RoulleteProps) {
  const [spin, setSpin] = useState(false);
  return (
    <div className="py-10 flex flex-col justify-center items-center">
      {donors?.length && npos?.length ? (
        <>
          <div className="">
            <span>The Lucky</span>
            <Wheel
              mustStartSpinning={spin}
              prizeNumber={0} // the winning address
              data={donors}
              backgroundColors={["#70d6ff", "#ff70a6", "#ff9770", "#ffd670"]}
              textColors={["#ffffff"]}
              outerBorderColor="#fff"
              radiusLineColor="#fff"
              // perpendicularText={true}
              textDistance={60}
              onStopSpinning={() => setSpin(false)}
            />
          </div>

          <ButtonMarquee text="Spin" onClick={() => setSpin(true)} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
