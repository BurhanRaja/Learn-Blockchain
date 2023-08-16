var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";
import fs from "fs";
import "dotenv/config";
const account_key = process.env.ACCOUNT_KEY;
const private_key = process.env.PRIVATE_KEY;
const rpc_url = process.env.RPC_URL;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new JsonRpcProvider(rpc_url);
        const wallet = new Wallet(private_key, provider);
        const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
        const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
        const contractFactory = new ContractFactory(abi, binary, wallet);
        console.log("Deploying the Contract. Please Wait....");
        const contract = yield contractFactory.deploy();
        const transactionReciept = yield contract.waitForDeployment();
        console.log("Here is the Deployment Transaction:- \n");
        console.log("\n");
        console.log(contract.deploymentTransaction());
        console.log("Here is the Transaction Reciept:- \n");
        console.log("\n");
        console.log(transactionReciept);
    });
}
main()
    .then(() => process.exit(0))
    .catch((err) => {
    console.log(err);
});
