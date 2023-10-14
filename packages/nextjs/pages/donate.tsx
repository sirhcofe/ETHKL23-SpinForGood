import React, { useCallback, useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function Donate() {
  const [donateVal, setDonateVal] = useState(0.001);

  const adjustDonateVal = (val: number) => {
    const res = donateVal + val;
    if (res > 0) setDonateVal(parseFloat(res.toFixed(5)));
    // else notification.warning("")
  };

  const multiplyBy1e18 = useCallback(value => {
    if (!value) {
      return;
    }
    if (typeof value === "bigint") {
      return value * 10n ** 18n;
    }
    return BigInt(Math.round(Number(value) * 10 ** 18));
  }, []);

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "donate",
    value: multiplyBy1e18(donateVal),
  });

  const onDonate = () => {
    if (donateVal > 0) {
      writeAsync();
    } else {
      notification.warning("You didn't set an amount to donate!");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full flex-1">
        <div className="flex flex-col gap-4 items-center p-10 w-[45rem] border-2 rounded-3xl border-black bg-white">
          <p className="font-bold text-3xl">🧡 Make a donation 🧡</p>
          <p className="text-center max-w-[400px]">
            Your awesome donation means you&apos;re in for a chance to join our fun lottery and score some prizes as our
            way of saying thanks for your support!
          </p>

          <div>
            <p className="text-sm opacity-70 w-full text-center mb-1">Donation distribution</p>
            <div className="w-[400px] flex rounded-xl overflow-clip">
              <div className="bg-yellow-500 w-[75%] h-8 flex justify-center items-center">
                <span className="text-yellow-200 font-bold">Donation</span>
              </div>
              <div className="bg-purple-500 w-[25%] h-8 flex justify-center items-center">
                <span className="text-purple-200 font-bold">Prize</span>
              </div>
            </div>
          </div>

          <div className="mt-6 my-2">
            <label className="ml-3">Donation Amount</label>
            <div className="mt-1 flex items-center input input-bordered bg-white">
              <label className="ml-2 font-bold text-xl select-none mr-2">ETH</label>
              <input
                className="w-60 font-bold text-xl"
                type="number"
                value={donateVal}
                onChange={e => setDonateVal(parseInt(e.currentTarget.value))}
              />
            </div>
            <label className="">
              <span className="ml-3 label-text-alt text-accent">Donation Pool: ETH{(donateVal * 0.75).toFixed(5)}</span>
              <span className="ml-3 label-text-alt text-primary">Prize Pool: ETH{(donateVal * 0.25).toFixed(5)}</span>
            </label>
          </div>

          <div className="flex justify-center items-center gap-2">
            <div className="flex flex-col gap-2">
              <button
                className="btn btn-outline btn-secondary"
                disabled={donateVal <= 0.1}
                onClick={() => adjustDonateVal(-0.1)}
              >
                - 0.1
              </button>
              <button
                className="btn btn-outline btn-secondary"
                disabled={donateVal <= 0.01}
                onClick={() => adjustDonateVal(-0.01)}
              >
                - 0.01
              </button>
              <button
                className="btn btn-outline btn-secondary"
                disabled={donateVal <= 0.001}
                onClick={() => adjustDonateVal(-0.001)}
              >
                - 0.001
              </button>
            </div>
            <div className="divider divider-horizontal"></div>

            <div className="flex flex-col gap-2">
              <button className="btn btn-outline btn-accent" onClick={() => adjustDonateVal(0.1)}>
                + 0.1
              </button>
              <button className="btn btn-outline btn-accent" onClick={() => adjustDonateVal(0.01)}>
                + 0.01
              </button>
              <button className="btn btn-outline btn-accent" onClick={() => adjustDonateVal(0.001)}>
                + 0.001
              </button>
            </div>
          </div>
          <button className="mt-10 btn btn-lg w-[200px] btn-primary overflow-hidden group" onClick={() => onDonate()}>
            <span className=" text-black font-bold group-hover:hidden ">Donate</span>
            <span className="hidden marquee-text text-black font-bold group-hover:block group-hover:animate-marquee">
              Donate
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
