import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ButtonMarquee from "~~/components/ButtonMarquee";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function Donate() {
  const [donateVal, setDonateVal] = useState(0.001);
  const [donate, setDonate] = useState(true);
  const [name, setName] = useState("Anonymous");
  const router = useRouter();

  useEffect(() => {
    if (donate === false) setDonate(true);
  }, [router.asPath]);

  const multiplyBy1e18 = useCallback(value => {
    if (!value) {
      return;
    }
    if (typeof value === "bigint") {
      return value * 10n ** 18n;
    }
    return BigInt(Math.round(Number(value) * 10 ** 18));
  }, []);

  const { writeAsync, isLoading, isSuccess } = useScaffoldContractWrite({
    contractName: "SFGContract",
    functionName: "donate",
    value: multiplyBy1e18(donateVal),
    args: [name === "" ? "Anonymous" : name],
  });

  const onDonate = () => {
    if (donateVal > 0) {
      writeAsync();
    } else {
      notification.warning("You didn't set an amount to donate!");
    }
  };

  useEffect(() => {
    setDonate(false);
  }, [isSuccess]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full flex-1 py-10">
        <div className="flex flex-col gap-4 items-center py-8 px-4 md:p-10 w-full max-w-[45rem] border-2 rounded-3xl border-black bg-base-100">
          {!donate && isSuccess ? (
            <>
              <p className="font-bold text-3xl">🧡 Thank you for your donation🧡</p>
              <button className="btn btn-primary mt-6" onClick={() => setDonate(true)}>
                Donate Again
              </button>
            </>
          ) : (
            <>
              <p className="font-bold text-3xl">🧡 Make a donation 🧡</p>
              <p className="text-center max-w-[400px]">
                Your awesome donation means you&apos;re in for a chance to join our fun lottery and score some prizes as
                our way of saying thanks for your support!
              </p>

              <div className="flex-1 w-full flex-col flex items-center">
                <p className="text-sm opacity-70 w-full text-center mb-1">Donation distribution</p>
                <div className="w-full max-w-[400px] flex rounded-xl overflow-clip">
                  <div className="bg-yellow-500 w-[75%] h-8 flex justify-center items-center">
                    <span className="text-yellow-200 font-bold">Donation</span>
                  </div>
                  <div className="bg-purple-500 w-[25%] h-8 flex justify-center items-center">
                    <span className="text-purple-200 font-bold">Prize</span>
                  </div>
                </div>
              </div>

              <div className="my-2 w-auto flex flex-col">
                <label className="ml-3 font-bold" htmlFor="name">
                  Name
                </label>
                <div className="mt-1 flex items-center input input-bordered bg-base-100 w-[360px]">
                  <input
                    className="w-full ml-2 bg-base-100 "
                    type="text"
                    placeholder="Leave empty to stay Anonymous"
                    onChange={e => setName(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div className="my-2 w-auto flex flex-col">
                <label className="ml-3 font-bold">Donation Amount</label>
                <div className="mt-1 flex items-center input input-bordered bg-base-100 w-[360px]">
                  <label className="ml-2 font-bold text-xl select-none mr-2">ETH</label>
                  <input
                    className="w-full font-bold text-xl bg-base-100"
                    type="number"
                    value={donateVal}
                    onChange={e => setDonateVal(parseFloat(e.currentTarget.value))}
                  />
                </div>
                <span className="ml-3 mt-2 text-accent">{`ETH${(donateVal * 0.75).toFixed(
                  5,
                )} into Donation Pool`}</span>
                <span className="ml-3  text-primary">{`ETH${(donateVal * 0.25).toFixed(5)} into Prize Pool`}</span>
              </div>
              <ButtonMarquee isLoading={isLoading} disabled={isLoading} onClick={() => onDonate()} text="Donate" />
            </>
          )}
        </div>
      </div>
    </>
  );
}
