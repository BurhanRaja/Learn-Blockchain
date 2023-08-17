import { Wallet } from "ethers";
import fs from "fs";
import "dotenv/config";

const private_key = process.env.PRIVATE_KEY as string;
const private_key_password = process.env.PRIVATE_KEY_PASSWORD as string;

async function main() {
  const wallet = new Wallet(private_key);
  const encryptedKey = await wallet.encrypt(private_key_password);
  fs.writeFileSync("./.encryptedKey.json", encryptedKey);
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.log(err));
