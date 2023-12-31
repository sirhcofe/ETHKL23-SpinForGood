import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function Register() {
  const { address } = useAccount();
  const [isNPO, setIsNPO] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [supportingDoc, setSupportingDoc] = useState("");

  const { writeAsync, isLoading, isSuccess } = useScaffoldContractWrite({
    contractName: "SFGContract",
    functionName: "registerNPO",
    args: [walletAddress, name],
  });

  const onSubmit = () => {
    if (!name || !email || walletAddress.length != 42 || !supportingDoc) {
      notification.warning("Invalid Fields!!");
    } else {
      writeAsync();
    }
  };

  const { data: qNPOs } = useScaffoldContractRead({
    contractName: "SFGContract",
    functionName: "getListOfNPOs",
  });

  useEffect(() => {
    if (qNPOs) {
      qNPOs.map((npo: any) => {
        if (address === npo.addr) {
          setIsNPO(true);
        }
      });
    }
    setShowWindow(true);
  }, [qNPOs]);

  return (
    <>
      {showWindow && (
        <div className="flex flex-col justify-center items-center h-full flex-1 py-10 mx-2">
          <div className="flex flex-col gap-4 items-center p-10 w-full max-w-[45rem] border-2 rounded-3xl border-black bg-base-100">
            {isNPO ? (
              <>
                <p className="font-bold text-3xl">🧡 Hello fellow NPO 🧡</p>
                <p className="text-center max-w-[400px]">
                  Your current wallet address is already registered as a NPO with our platform!
                </p>
              </>
            ) : (
              <>
                {isSuccess ? (
                  <>
                    <p className="font-bold text-2xl lg:text-3xl text-center">🧡 Registration Complete! 🧡</p>
                    <p className="font-bold text-lg text-center">
                      Please allow us some time to process your documents.
                      <br />
                      Take this time to browse around!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-3xl">🧡 Register 🧡</p>
                    <p className="text-center max-w-[400px]">
                      Register your Non-Profit Organization to be able to participate in our donation lottery!
                    </p>
                    <div className="flex flex-col max-w-[400px]">
                      <p className="text-center font-extrabold w-full">**NOTE**</p>
                      <p className="text-center w-full">
                        You will no longer be able to donate with the current wallet address after registering as a NPO!
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold" htmlFor="name">
                          NPO Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="input input-bordered "
                          placeholder="ABC Old Folks Home"
                          required
                          onInput={e => setName(e.currentTarget.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="input input-bordered "
                          placeholder="abc@gmail.com"
                          required
                          onInput={e => setEmail(e.currentTarget.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label className="font-bold" htmlFor="name">
                          Wallet Address
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="input input-bordered "
                          placeholder="0x30c0114Ba7Afa450Dd32ba0c576a888379312BfB"
                          required
                          onInput={e => setWalletAddress(e.currentTarget.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold" htmlFor="name">
                          Supporting Documentations
                        </label>
                        <input
                          type="file"
                          name="file"
                          id="file"
                          className="file-input file-input-bordered "
                          required
                          onInput={e => setSupportingDoc(e.currentTarget.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold" htmlFor="name">
                          Additional Information
                        </label>
                        <textarea
                          name="name"
                          id="name"
                          className="textarea textarea-bordered "
                          placeholder="Please provide any additional information you would like us to know."
                        />
                      </div>
                      <button className="btn  btn-secondary" onClick={() => onSubmit()} disabled={isLoading}>
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
