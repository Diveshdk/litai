import LitJsSdk from 'lit-js-sdk';

export const litClient = new LitJsSdk.LitNodeClient();
await litClient.connect();

export const getAuthSig = async () => {
  return await LitJsSdk.checkAndSignAuthMessage({ chain: process.env.NEXT_PUBLIC_CHAIN });
};

export const signTransaction = async (transactionData, authSig) => {
  const signedTransaction = await litClient.signAndExecuteTransaction({
    accessControlConditions: [
      {
        conditionType: 'evmBasic',
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        standardContractType: '',
        chain: process.env.NEXT_PUBLIC_CHAIN,
        method: 'balanceOf',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>=',
          value: '1',
        },
      },
    ],
    authSig,
    chain: process.env.NEXT_PUBLIC_CHAIN,
    transactionData,
  });

  return signedTransaction;
};
// utils/contract.js
import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const abi = [
  // Include the ABI of your smart contract here
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "bytes32", "name": "key", "type": "bytes32" }
    ],
    "name": "setKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getKey",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const getContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
};

export const setKey = async (user, key) => {
  const contract = getContract();
  const tx = await contract.setKey(user, key);
  await tx.wait();
  return tx;
};

export const getKey = async (user) => {
  const contract = getContract();
  const key = await contract.getKey(user);
  return key;
};
