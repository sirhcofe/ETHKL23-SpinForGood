import { useEffect, useState } from "react";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useAccount } from "wagmi";
// import { mainnet } from "viem/chains";
// import { useNetwork } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Address, Balance, getParsedError } from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// const localWalletClient = createWalletClient({
//   // chain: hardhat,
//   chain: sepolia,
//   transport: http(),
// });

/**
 * Faucet modal which lets you send ETH to any address.
 */
export const SepoliaFaucet = () => {
  const [loading, setLoading] = useState(false);
  const [faucetAddress, setFaucetAddress] = useState<any>();
  const { address } = useAccount();
  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_FAUCET_PRIVATE || "0"}`);

  const faucetTxn = useTransactor();

  useEffect(() => {
    const getFaucetAddress = async () => {
      try {
        // const accounts = await client.getAddresses();
        // setFaucetAddress(accounts[FAUCET_ACCOUNT_INDEX]);
        setFaucetAddress(account);
      } catch (error) {
        notification.error(
          <>
            <p className="font-bold mt-0 mb-1">Cannot connect to sepolia provider</p>
          </>,
        );
        console.error("⚡️ ~ file: Faucet.tsx:getFaucetAddress ~ error", error);
      }
    };
    getFaucetAddress();
  }, []);

  const sendETH = async () => {
    // if (!faucetAddress) {
    //   return;
    // }
    try {
      setLoading(true);

      const response = await fetch("/api/getFaucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
        }),
      });

      if (!response.ok) {
        throw new Error("You should already received faucet!");
      }

      await faucetTxn({
        to: address,
        value: parseEther("0.05"),
        account: faucetAddress,
        chain: sepolia,
      });
      setLoading(false);
    } catch (error) {
      const parsedError = getParsedError(error);
      console.error("⚡️ ~ file: Faucet.tsx:sendETH ~ error", error);
      notification.error(parsedError);
      setLoading(false);
    }
  };

  // Render only on local chain
  //   if (ConnectedChain?.id !== hardhat.id) {
  //     return null;
  //   }

  return (
    <div>
      <label
        htmlFor="sfg-sepolia-faucet-modal"
        className="btn btn-primary btn-sm px-2 rounded-full font-normal normal-case"
      >
        <BanknotesIcon className="h-4 w-4" />
        <span> Sepolia Faucet</span>
      </label>
      <input type="checkbox" id="sfg-sepolia-faucet-modal" className="modal-toggle" />
      <label htmlFor="sfg-sepolia-faucet-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-3">Sepolia Faucet for SFG</h3>
          <label htmlFor="sfg-sepolia-faucet-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="flex space-x-4">
            <div>
              <span className="text-sm font-bold">From:</span>
              <Address address={process.env.NEXT_PUBLIC_FAUCET} />
            </div>
            <div>
              <span className="text-sm font-bold pl-3">Available:</span>
              <Balance address={process.env.NEXT_PUBLIC_FAUCET} />
            </div>
          </div>

          <button className="btn btn-secondary w-full mt-4" onClick={sendETH}>
            {loading && <span className={loading ? "loading loading-spinner" : ""}></span>}
            Get 0.05 ETH
          </button>
        </label>
      </label>
    </div>
  );
};
