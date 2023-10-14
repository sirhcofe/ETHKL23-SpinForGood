import React, { useEffect, useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export default function Home() {
  const [donors, setDonors] = useState([]);

  const { data: Donors } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "getListOfDonors",
  });

  useEffect(() => {
    setDonors(Donors);
  }, [Donors]);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="rounded-xl p-10 max-w-4xl w-full bg-base-100 border-2 border-black">
        <p className="font-bold text-3xl">Recently Donated</p>
        <ul className="mt-4 flex flex-col gap-3">
          {donors?.map((data, i) => (
            <li key={i} className="bg-base-100 p-2 px-4 rounded-lg border border-black">
              {data.user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
