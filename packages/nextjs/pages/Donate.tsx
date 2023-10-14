import React, { useState } from "react";

export default function Donate() {
  const [donateVal, setDonateVal] = useState(0.001);

  const adjustDonateVal = (val: number) => {
    const res = donateVal + val;
    if (res > 0) setDonateVal(res);
    // else notification.warning("")
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full flex-1">
        <div className="flex flex-col gap-4 items-center p-10 w-[45rem] border-2 rounded-3xl border-black bg-white">
          <p className="font-bold text-3xl">Make a donation 🧡</p>
          <p className="text-center max-w-[400px]">
            Your awesome donation means you&apos;re in for a chance to join our fun lottery and score some prizes as our
            way of saying thanks for your support!
          </p>

          <div>
            <p className="text-sm opacity-70 w-full text-center mb-1">Donation distribution</p>
            <div className="w-[400px] flex rounded-xl overflow-clip">
              <div className="bg-yellow-500 w-[75%] h-10 flex justify-center items-center">
                <span className="text-yellow-200 font-bold">Donation</span>
              </div>
              <div className="bg-purple-500 w-[25%] h-10 flex justify-center items-center">
                <span className="text-purple-200 font-bold">Prize</span>
              </div>
            </div>
          </div>

          <div className="flex items-center my-6 input input-bordered bg-white">
            <label className="ml-2 font-bold text-xl text-gray-600 mr-2">ETH</label>
            <input
              className="w-60 font-bold text-xl"
              type="number"
              value={donateVal}
              onChange={e => setDonateVal(parseInt(e.currentTarget.value))}
            />
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
          <button className="mt-10 btn btn-lg w-[200px] btn-primary overflow-hidden group">
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
