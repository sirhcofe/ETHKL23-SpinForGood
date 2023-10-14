import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import ButtonMarquee from "~~/components/ButtonMarquee";
// import CustomCountdown from "~~/components/CustomCountdown";
// import ButtonMarquee from "~~/components/ButtonMarquee";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { formattedAddress } from "~~/utils/formatAddress";

// const DynamicWheel = dynamic(() => import("~~/components/Roullete"), {
//   ssr: false,
// });

const CustomCountdown = dynamic(() => import("~~/components/CustomCountdown"));

export default function Home() {
  const [donors, setDonors] = useState<any[]>([]);
  const [npos, setNPOs] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [prizePool, setPrizePool] = useState<any>(0);
  const [donationPool, setDonationPool] = useState<any>(0);

  useEffect(() => {
    setIsClient(true);
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
    if (qPrizePool) {
      setPrizePool((Number(qPrizePool) / 10 ** 18).toString());
    }
  }, [qPrizePool]);

  useEffect(() => {
    if (qDonationPool) {
      setDonationPool((Number(qDonationPool) / 10 ** 18).toString());
    }
  }, [qDonationPool]);

  return (
    <>
      {isClient ? (
        <div className="flex-1 flex-col flex items-center justify-center">
          <CustomCountdown />

          <div>
            <h1 className="text-6xl font-bold">Donation Pool:</h1>
            <p className="text-4xl font-bold">{donationPool} ETH</p>
          </div>
          <div>
            <h1 className="text-6xl font-bold">Prize Pool:</h1>
            <p className="text-4xl font-bold">{prizePool} ETH</p>
          </div>

          {/* <DynamicWheel donors={donors} npos={npos} /> */}

          <div className="rounded-xl p-6 md:px-10 md:py-8 max-w-4xl w-full ">
            {donors.length ? (
              <>
                <p className="font-bold text-3xl">Top Donaters</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {donors?.map((data, i) => (
                    <li key={i} className="flex justify-between bg-base-100 p-2 px-4 rounded-lg border border-black">
                      <p className="text-elipsis w-full truncate mr-4">
                        {data.name === "Anonymous" ? data.user : data.name}
                      </p>
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
      ) : (
        <></>
      )}
    </>
  );
}
