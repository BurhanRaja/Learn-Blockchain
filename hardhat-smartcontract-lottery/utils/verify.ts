import { run } from "hardhat";

const verify = async function (contractAddress: string, args: Array<any>) {
  console.log("Verifying Contract. Please wait...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    console.log(err);
  }
};

export default verify;
