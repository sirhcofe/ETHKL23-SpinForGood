import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import ButtonMarquee from "~~/components/ButtonMarquee";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { formattedAddress } from "~~/utils/formatAddress";

const DynamicWheel = dynamic(() => import("~~/components/Roullete"), {
  ssr: false,
});

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
      setPrizePool((Number(qPrizePool) / 10 ** 18).toString());
    }
  }, [qPrizePool]);

  useEffect(() => {
    if (qDonationPool) {
      setDonationPool((Number(qDonationPool) / 10 ** 18).toString());
    }
  }, [qDonationPool]);

  return (
    <div className="flex-1 flex-col flex items-center justify-center">
      <div>
        <h1 className="text-6xl font-bold">Donation Pool:</h1>
        <p className="text-4xl font-bold">{donationPool} ETH</p>
      </div>
      <div>
        <h1 className="text-6xl font-bold">Prize Pool:</h1>
        <p className="text-4xl font-bold">{prizePool} ETH</p>
      </div>
      <div className="rounded-xl p-10 max-w-4xl w-full bg-base-100 border-2 border-black">
        {donors.length ? (
          <>
            <p className="font-bold text-3xl">Recently Donated</p>
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
    // <div className="">
    //   {isClient ? (
    //     <div className="flex-1 flex  flex-col justify-center items-center px-4">
    //       <DynamicWheel donors={donors} npos={npos} />
    //       {/* <ButtonMarquee text="Start Routlette" /> */}
    //       <div className="rounded-xl p-10 max-w-4xl w-full bg-base-100 border-2 border-black">
    //         {donors.length ? (
    //           <>
    //             <p className="font-bold text-3xl">Recently Donated</p>
    //             <ul className="mt-4 flex flex-col gap-3">
    //               {donors?.map((data, i) => (
    //                 <li key={i} className="bg-base-100 p-2 px-4 rounded-lg border border-black">
    //                   <p className="text-elipsis w-full truncate">{data.user}</p>
    //                 </li>
    //               ))}
    //             </ul>
    //           </>
    //         ) : (
    //           <p className="font-bold text-3xl">No one donated 😢</p>
    //         )}
    //       </div>
    //     </div>
    //   ) : (
    //     <></>
    //   )}
    // </div>
  );
}
