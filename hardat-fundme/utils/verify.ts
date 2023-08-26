import { run } from "hardhat";

const verify = async (contractAddress: string, args: Array<any>) => {
  console.log("Verifying Contract. Please Wait...");

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
