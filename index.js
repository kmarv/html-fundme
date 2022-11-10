import { ethers } from "./ether-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
    connectButton.innerHTML = "Connected";
  } else {
    console.log("MetaMask not found");
    connectButton.innerHTML = "MetaMask not found";
  }
}
async function withdraw() {
  if (typeof window.ethereum != " undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', [])
    const signer =  provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenFortransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}


async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log("Funding with", ethAmount);
  if (typeof window.ethereum !== "undefined") {
    //  get provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // get signer
    const signer = provider.getSigner();
    // get contract
    //  requires abi, contract address, signer
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // listen fro the tx to be mined
      await listenFortransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

async function getBalance() {
  console.log(contractAddress);
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

function listenFortransactionMine(transactionResponse, provider) {
  console.log("Mining", transactionResponse.hash);
  return new Promise((resolve, reject) => {
    // listen for tx to finish
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}


