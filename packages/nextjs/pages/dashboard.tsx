import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { formattedAddress } from "~~/utils/formatAddress";

const DynamicWheel = dynamic(() => import("~~/components/Roullete"), {
  ssr: false,
});

function Counter({ value, direction = "up" }: { value: number; direction?: "up" | "down" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    console.log("value", value);
  }, []);

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [motionValue, isInView]);

  useEffect(
    () =>
      springValue.on("change", latest => {
        if (ref.current) {
          // Format the number with 2 decimal places
          const formattedValue = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
          }).format(latest);
          ref.current.textContent = formattedValue;
        }
      }),
    [springValue],
  );

  return <span className="text-3xl md:text-6xl font-bold" ref={ref} />;
}

export default function Home() {
  const [donors, setDonors] = useState<any[]>([]);
  const [npos, setNPOs] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [runCounter, setRunCounter] = useState(false);
  const [prizePool, setPrizePool] = useState(0);
  const [donationPool, setDonationPool] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setRunCounter(false);
  }, []);

  const { data: qDonors } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfDonors",
  });

  const { data: qNPOs } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfNPOs",
  });

  const { data: qPrizePool } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getPrizePool",
  });

  const { data: qDonationPool } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getDonationPool",
  });

  useEffect(() => {
    if (qDonors) {
      const newDonors = qDonors.map((donor, i) => {
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
    if (prizePool !== 0 && donationPool !== 0) {
      setRunCounter(true);
    }
  }, [prizePool, donationPool]);

  useEffect(() => {
    if (qNPOs) {
      const newNPOs = qNPOs.map(npo => {
        return {
          ori: npo.addr,
          option: formattedAddress(npo.addr),
        };
      });
      setNPOs(newNPOs);
    }
  }, [qNPOs]);

  useEffect(() => {
    if (qPrizePool) {
      setPrizePool(Number(qPrizePool) / 10 ** 18);
    }
  }, [qPrizePool]);

  useEffect(() => {
    if (qDonationPool) {
      setDonationPool(Number(qDonationPool) / 10 ** 18);
    }
  }, [qDonationPool]);

  return (
    <div className="flex-1 flex-col flex items-center justify-center">
      <div className="w-full flex flex-col md:flex-row justify center md:justify-between px-4 md:px-60">
        <div className="flex flex-col w-[85%] md:w-[45%] rounded-xl py-5 md:py-10 px-6 md:px-14 border-2 border-[#291334] space-y-10 justify-between">
          <div className="w-full">
            <h1 className="text-2xl md:text-4xl font-bold">Donation Pool:</h1>
            {runCounter === true && (
              <div className="flex space-x-2 items-end">
                <Counter value={donationPool} />
                <p className="text-3xl md:text-5xl font-bold">ETH</p>
              </div>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-2xl md:text-4xl font-bold">Prize Pool:</h1>
            {runCounter === true && (
              <div className="flex space-x-2 items-end">
                <Counter value={prizePool} />
                <p className="text-3xl md:text-5xl font-bold">ETH</p>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-xl py-5 md:py-10 px-6 md:px-14 w-[85%] md:w-[45%] h-fit md:h-[324px] md:overflow-y-scroll bg-base-100 border-2 border-black">
          {donors.length ? (
            <>
              <p className="font-bold  text-2xl md:text-4xl">Top Donors</p>
              <ul className="mt-4 flex flex-col gap-3">
                {donors?.map((data, i) => (
                  <li key={i} className="flex justify-between bg-base-100 p-2 px-4 rounded-lg border border-black">
                    <p className="text-elipsis w-full truncate">{data.name}</p>
                    <p>{Number(data.amount) / 10 ** 18}ETH</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="font-bold text-3xl">No one donated 😢</p>
          )}
        </div>
      </div>
    </div>
  );
}
