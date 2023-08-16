import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";
import fs from "fs";
import "dotenv/config";

const account_key = process.env.ACCOUNT_KEY as string;
const private_key = process.env.PRIVATE_KEY as string;
const rpc_url = process.env.RPC_URL;

async function main() {
  const provider = new JsonRpcProvider(rpc_url);
  const wallet = new Wallet(private_key, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ContractFactory(abi, binary, wallet);
  console.log("Deploying the Contract. Please Wait....");
  const contract = await contractFactory.deploy();

  const transactionReciept = await contract.waitForDeployment();
  console.log("Here is the Deployment Transaction:- \n");
  console.log(contract.deploymentTransaction());
  console.log("\n");
  console.log("Here is the Transaction Reciept:- \n");
  console.log(transactionReciept);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
  });
