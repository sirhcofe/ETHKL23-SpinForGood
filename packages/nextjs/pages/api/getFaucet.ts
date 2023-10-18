import fsPromises from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// const FAUCET_ACCOUNT_INDEX = 0;

const dataFilePath = path.join(process.cwd(), "json/faucetAddrs.json");

// const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_FAUCET_PRIVATE || "0"}`);

// const walletClient = createWalletClient({
//   account,
//   // chain: hardhat,
//   chain: sepolia,
//   transport: http(),
// });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Read the existing data from the JSON file
  const jsonData = await fsPromises.readFile(dataFilePath, "utf-8");
  const objectData: string[] = JSON.parse(jsonData);

  let hash;

  if (req.method === "GET") {
    res.status(200).json(objectData);
  } else if (req.method === "POST") {
    // Code for POST requests goes here
    try {
      // Get the data from the request body
      const body = req.body;
      // Check if requesting address is new
      if (objectData.find(ele => ele === body.address)) throw new Error("Already received faucet");

      // Send 0.05 ETH to the address in the request body (having http error with sepolia)
      // const tx = await walletClient.sendTransaction({
      //   to: body.address,
      //   value: parseEther("0.05"),
      // });
      // hash = tx;

      // Add the new address to the object
      objectData.push(body.address);

      // Convert the object back to a JSON string
      const updatedData = JSON.stringify(objectData);

      // Write the updated data to the JSON file
      await fsPromises.writeFile(dataFilePath, updatedData);

      // Send a success response
      res.status(200).json({ message: "Data stored successfully", data: hash });
    } catch (error) {
      console.error(error);
      // Send an error response
      res.status(500).json({ message: "Error storing data" });
    }
  }
}
