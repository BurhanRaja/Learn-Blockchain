import { ethers } from "./ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const balanceBtn = document.getElementById("balanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const fundBtn = document.getElementById("fundBtn");
const amountInp = document.getElementById("ethAmount");

connectBtn.onclick = connect;
fundBtn.onclick = fund;
balanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

async function connect() {
  console.log("Hello");
  if (typeof window["ethereum"] !== "undefined") {
    try {
      connectBtn.innerText = "Connected";
      const accounts = await window["ethereum"].request({
        method: "eth_accounts",
      });
      console.log(accounts);
    } catch (err) {
      console.log(err);
    }
  } else {
    connectBtn.innerText = "Please install MetaMask";
  }
}

async function fund() {
  const amount = amountInp.value;
  console.log(`Funding with ${amount}`);
  if (typeof window["ethereum"] !== "undefined") {
    const provider = new ethers.BrowserProvider(window["ethereum"]);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(amount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (err) {
      console.log(err);
    }
  }
}

async function getBalance() {
  if (typeof window["ethereum"] !== "undefined") {
    const provider = new ethers.BrowserProvider(window["ethereum"]);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(`Current Balance: ${ethers.formatEther(balance)}.`);
    } catch (err) {
      console.log(err);
    }
  }
}

async function withdraw() {
  console.log(`Withdrawing...`);
  if (typeof window["ethereum"] !== "undefined") {
    const provider = new ethers.BrowserProvider(window["ethereum"]);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (err) {
      console.log(err);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Completed with ${transactionReciept.confirmations} confirmtations.`
      );
      resolve("");
    });
  });
}
